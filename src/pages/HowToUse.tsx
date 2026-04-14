import { type ReactNode, useState } from "react";

type Tab = "app" | "minecraft";

interface Step {
	icon: string;
	title: string;
	desc: ReactNode;
}

const APP_STEPS: Step[] = [
	{
		icon: "01",
		title: "Locate a Dataless Gateway",
		desc: (
			<>
				Find a Dataless End Gateway in the End Dimension. They appear around the central island
				after defeating the Ender Dragon or manipulating the world generation to transform an Outer
				End Gateway into a Dataless (
				<a
					href="https://github.com/Threadstone-Wiki/Threadstone-Wiki/blob/main/pages/hyperlink.md"
					target="_blank"
					rel="noopener noreferrer"
					className="text-bolt-bright hover:text-bolt transition-colors underline underline-offset-2"
				>
					Threadstone 1.12
				</a>
				). Note the coordinates X and Z indicated from the target_block with F3.
			</>
		),
	},
	{
		icon: "02",
		title: "Enter the coordinates",
		desc: "Type the Gateway's X and Z coordinates into the input fields labelled Gateway Origin. The map will update in real time.",
	},
	{
		icon: "03",
		title: "Adjust target distance",
		desc: "Use the slider or type a value between 768 and 1280 blocks. This controls how far from the island origin your destination will be.",
	},
	{
		icon: "04",
		title: "Read the results",
		desc: "The calculator shows the bearing angle (in radians and degrees) and the final X/Z destination coordinates. The End Map visualises the trajectory.",
	},
	/*{
		icon: "05",
		title: "Copy the block list",
		desc: "Scroll down to Blocks Required. It lists exactly how many blocks to place along the path so you can bridge to your destination safely.",
	},*/
];

const MINECRAFT_STEPS: Step[] = [
	{
		icon: "I",
		title: "Build the guiding line",
		desc: "Build a line guiding with the block list from the max point to the target coordinates. Recommend build the line with an instaminable block like slime or netherrack in case you want to quit this guide line after manipulate the Gateway. It's also recommended to use World Edit with the /line command for a quick guide.",
	},
	{
		icon: "II",
		title: "Place an End Stone block into the target chunk",
		desc: "Place an End Stone block into the target chunk to force the End Gateway to generate in the point you want.",
	},
	{
		icon: "III",
		title: "Place a block where you want the Gateway to generate",
		desc: "Place a block for the Gateway to generate on top of it. The block can be any solid block, but it must be placed in the same chunk as the target coordinates and within 16 blocks of the target point. This block needs to be the tallest in the chunk so the game can generate the gateway on top of it.",
	},
	{
		icon: "IV",
		title: "Go to Origin End Gateway",
		desc: "Travel to the original End Gateway you used to get the coordinates. This is the End Gateway you used to get the coordinates",
	},
	{
		icon: "V",
		title: "Enter into the Gateway",
		desc: "Enter into the Gateway. The new End Gateway should generate in the point you placed the block in step III. Recommend make a backup of your world before doing this step, in case something goes wrong with the generation and you want to try again.",
	},
];

export function HowToUse() {
	const [active, setActive] = useState<Tab>("app");

	const steps = active === "app" ? APP_STEPS : MINECRAFT_STEPS;

	return (
		<div className="font-mono">
			{/* Title */}
			<div className="mb-5">
				<p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Documentation</p>
				<h2
					className="font-display text-base font-bold tracking-widest text-bolt-bright"
					style={{ textShadow: "0 0 16px rgba(192,132,252,0.45)" }}
				>
					HOW TO USE
				</h2>
			</div>

			{/* Tabs */}
			<div className="flex gap-1 mb-5 border-b border-border pb-0">
				{(["app", "minecraft"] as Tab[]).map((tab) => {
					const label = tab === "app" ? "App Usage" : "In Minecraft";
					const accent = tab === "app" ? "bg-bolt" : "bg-arc";
					const isActive = active === tab;
					return (
						<button
							key={tab}
							onClick={() => setActive(tab)}
							className={`relative px-4 py-2 text-[11px] uppercase tracking-widest transition-colors duration-150 cursor-pointer ${
								isActive ? "text-bolt-bright" : "text-text-muted hover:text-text-secondary"
							}`}
						>
							{label}
							{isActive && (
								<span
									className={`absolute bottom-0 left-0 right-0 h-px ${accent}`}
									style={{ boxShadow: "0 0 6px currentColor" }}
								/>
							)}
						</button>
					);
				})}
			</div>

			{/* Steps */}
			<div className="overflow-y-auto pr-2" style={{ maxHeight: "min(60vh, 480px)" }}>
				<ol className="flex flex-col gap-4">
					{steps.map((step) => (
						<li key={step.icon} className="flex gap-4 group">
							{/* Step number */}
							<div className="flex-none w-8 h-8 rounded border border-border bg-elevated flex items-center justify-center">
								<span
									className={`text-[10px] font-display font-bold ${
										active === "app" ? "text-bolt" : "text-arc"
									}`}
								>
									{step.icon}
								</span>
							</div>

							{/* Content */}
							<div className="flex-1 min-w-0 pt-0.5">
								<p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide mb-1">
									{step.title}
								</p>
								<p className="text-[12px] text-text-muted leading-relaxed wrap-break-word">
									{step.desc}
								</p>
							</div>
						</li>
					))}
				</ol>

				{/* Footer hint */}
				<div className="mt-6 pt-4 border-t border-border">
					<p className="text-[10px] text-text-muted text-center tracking-wide">
						{active === "app"
							? "All calculations update in real time — no need to press any button."
							: "Coordinates shown in the F3 debug screen (Java Edition only)."}
					</p>
				</div>
			</div>
		</div>
	);
}
