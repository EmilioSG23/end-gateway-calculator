import { CopyIcon } from "@/icons/Copy";
import type { Coords } from "@/types/Coords";
import { useCallback, useState } from "react";

interface CommandsProps {
	origin: Coords;
	finalCoords: Coords;
	blocks: Coords[];
}

interface CommandEntry {
	id: string;
	cmd: string;
}

interface CommandGroupProps {
	title: string;
	tag: string;
	tagColor: string;
	description: string;
	commands: CommandEntry[];
	copied: string | null;
	onCopy: (text: string, id: string) => void;
	onCopyAll: () => void;
	defaultOpen?: boolean;
}

function ChevronIcon({ open }: { open: boolean }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
			aria-hidden="true"
		>
			<polyline points="6 9 12 15 18 9" />
		</svg>
	);
}

function CommandRow({
	entry,
	copied,
	onCopy,
}: {
	entry: CommandEntry;
	copied: string | null;
	onCopy: (text: string, id: string) => void;
}) {
	const isCopied = copied === entry.id;
	return (
		<div className="group flex items-center gap-2 px-3 py-1.5 rounded bg-deep border border-border hover:border-purpur-dim transition-colors">
			<code className="flex-1 text-[11px] font-mono text-text-secondary truncate select-all">
				{entry.cmd}
			</code>
			<button
				onClick={() => onCopy(entry.cmd, entry.id)}
				className={`shrink-0 flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border transition-all cursor-pointer ${
					isCopied
						? "border-bolt-glow text-bolt-glow bg-bolt/10"
						: "border-border text-muted hover:border-purpur hover:text-bolt-glow"
				}`}
				aria-label="Copy command"
			>
				{isCopied ? (
					"✓ copied"
				) : (
					<>
						<CopyIcon className="w-3 h-3" />
						copy
					</>
				)}
			</button>
		</div>
	);
}

function CommandGroup({
	title,
	tag,
	tagColor,
	description,
	commands,
	copied,
	onCopy,
	onCopyAll,
	defaultOpen = true,
}: CommandGroupProps) {
	const [open, setOpen] = useState(defaultOpen);

	return (
		<div className="rounded-lg border border-border bg-surface/50 overflow-hidden">
			{/* Accordion header */}
			<button
				onClick={() => setOpen((v) => !v)}
				className="w-full px-4 py-3 flex items-center gap-3 hover:bg-elevated/40 transition-colors cursor-pointer"
				aria-expanded={open}
			>
				<h3 className="text-xs font-bold text-text-primary uppercase tracking-widest font-display flex-1 text-left">
					{title}
				</h3>
				<span
					className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border ${tagColor}`}
				>
					{tag}
				</span>
				<ChevronIcon open={open} />
			</button>

			{/* Collapsible content */}
			{open && (
				<>
					<div className="h-px bg-border" />

					{/* Description */}
					<p className="px-4 pt-3 pb-2 text-[10px] text-muted leading-relaxed">{description}</p>

					{/* Commands */}
					<div className="px-4 pb-3 flex flex-col gap-1.5">
						{commands.map((entry) => (
							<CommandRow key={entry.id} entry={entry} copied={copied} onCopy={onCopy} />
						))}
					</div>

					{/* Copy all footer */}
					<div className="px-4 py-2 border-t border-border flex items-center justify-between bg-deep/40">
						<span className="text-[10px] text-muted">
							{commands.length} command{commands.length !== 1 ? "s" : ""}
						</span>
						<button
							onClick={onCopyAll}
							className="flex items-center gap-1.5 text-[10px] font-mono px-3 py-1 rounded border border-purpur-dim text-bolt-glow hover:bg-purpur/10 transition-colors cursor-pointer"
						>
							<CopyIcon className="w-3 h-3" />
							Copy all
						</button>
					</div>
				</>
			)}
		</div>
	);
}

export function Commands({ origin, finalCoords, blocks }: CommandsProps) {
	const [yLevel, setYLevel] = useState<number>(0);
	const [copied, setCopied] = useState<string | null>(null);

	const copyText = useCallback((text: string, id: string) => {
		navigator.clipboard.writeText(text).then(() => {
			setCopied(id);
			setTimeout(() => setCopied(null), 2000);
		});
	}, []);

	// Minecraft - utils commands
	const mcCommands: CommandEntry[] = [
		{ id: "tp-origin", cmd: `/tp @p ${origin.x} ${yLevel ?? "~"} ${origin.z}` },
		{ id: "tp-final", cmd: `/tp @p ${finalCoords.x} ${yLevel ?? "~"} ${finalCoords.z}` },
		{ id: "set-origin-gateway", cmd: `/setblock ${origin.x} ${yLevel} ${origin.z} end_gateway` },
		{
			id: "set-final-gateway",
			cmd: `/setblock ${finalCoords.x} ${yLevel} ${finalCoords.z} end_gateway`,
		},
	];

	// WorldEdit — line between origin and destination (3 commands)
	const weLineCommands: CommandEntry[] = [
		{ id: "we-pos1", cmd: `//pos1 ${origin.x},${yLevel},${origin.z}` },
		{ id: "we-pos2", cmd: `//pos2 ${finalCoords.x},${yLevel},${finalCoords.z}` },
		{ id: "we-line", cmd: `//line slime_block` },
	];

	// Vanilla — individual /setblock per computed coordinate
	const vanillaPathLineCommands: CommandEntry[] = blocks.map((b, i) => ({
		id: `v-setblock-${i}`,
		cmd: `/setblock ${b.x} ${yLevel} ${b.z} slime_block`,
	}));

	const copyAll = (commands: CommandEntry[]) => {
		const text = commands.map((c) => c.cmd).join("\n");
		navigator.clipboard.writeText(text).then(() => {
			setCopied("__all__");
			setTimeout(() => setCopied(null), 2000);
		});
	};

	return (
		<div className="h-full flex flex-col">
			{/* Fixed top: title + controls */}
			<div className="shrink-0 flex flex-col gap-4 pb-4">
				{/* Title */}
				<div>
					<h2 className="font-display text-sm font-bold uppercase tracking-widest text-text-primary mb-1">
						Minecraft Commands
					</h2>
					<p className="text-[10px] text-muted">
						Place blocks along the computed path. Set the Y level before copying. It is recommended
						to use instaminable blocks, like slime or netherrack in case you want to destroy the
						path. This commands are useful in creative mode for testing purposes.
					</p>
				</div>

				{/* Y level + coordinate summary */}
				<div className="grid grid-cols-2 gap-3">
					<div className="flex flex-col gap-1">
						<label className="text-[10px] text-muted uppercase tracking-widest">
							Build Height (Y)
						</label>
						<input
							type="number"
							min={0}
							max={255}
							value={yLevel}
							onChange={(e) => setYLevel(Math.min(255, Math.max(0, Number(e.target.value))))}
							className="h-full bg-deep border border-border rounded px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-purpur transition-colors w-full"
							step={1}
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<span className="text-[10px] text-muted uppercase tracking-widest">Path summary</span>
						<div className="bg-deep border border-border rounded px-3 py-2 text-[11px] font-mono text-muted flex flex-col gap-0.5">
							<span>
								Origin{" "}
								<span className="text-arc">
									({origin.x}, {yLevel}, {origin.z})
								</span>
							</span>
							<span>
								Final{" "}
								<span className="text-bolt-glow">
									({finalCoords.x}, {yLevel}, {finalCoords.z})
								</span>
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Scrollable groups */}
			<div className="overflow-y-auto pr-1" style={{ maxHeight: "min(60vh, 480px)" }}>
				<div className="flex flex-col gap-4 pr-1">
					<CommandGroup
						title="Minecraft Utils Commands"
						tag="vanilla minecraft"
						tagColor="border-arc-dim text-arc"
						description="Utility commands for teleporting and setting gateways."
						commands={mcCommands}
						copied={copied}
						onCopy={copyText}
						onCopyAll={() => copyAll(mcCommands)}
					/>

					<CommandGroup
						title="WorldEdit Line"
						tag="requires WorldEdit"
						tagColor="border-purpur-dim text-purpur"
						description="Sets pos1 at the gateway origin, pos2 at the destination, then draws a slime block line between them. Fast — only 3 commands."
						commands={weLineCommands}
						copied={copied}
						onCopy={copyText}
						onCopyAll={() => copyAll(weLineCommands)}
						defaultOpen={false}
					/>

					<CommandGroup
						title="Vanilla Path Line Setblock"
						tag="vanilla minecraft"
						tagColor="border-arc-dim text-arc"
						description={`Places each computed block individually using /setblock. Exact path — ${blocks.length} commands total. Paste into a command block chain or a data pack function file.`}
						commands={vanillaPathLineCommands}
						copied={copied}
						onCopy={copyText}
						onCopyAll={() => copyAll(vanillaPathLineCommands)}
						defaultOpen={false}
					/>

					{/* Bottom padding so last item doesn't clip */}
					<div className="h-1 shrink-0" />
				</div>
			</div>
		</div>
	);
}
