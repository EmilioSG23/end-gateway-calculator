import type { Coords } from "@/types/Coords";

interface BlockListProps {
	blocks: Coords[];
}

export function BlockList({ blocks }: BlockListProps) {
	if (blocks.length === 0) return null;

	return (
		<div className="max-h-60 overflow-y-auto rounded border border-[#1e1e38] bg-void">
			<table className="w-full text-xs font-mono">
				<thead className="sticky top-0 bg-surface border-b border-[#1e1e38]">
					<tr>
						<th className="px-3 py-2 text-left text-text-muted font-normal">#</th>
						<th className="px-3 py-2 text-left text-text-muted font-normal">X</th>
						<th className="px-3 py-2 text-left text-text-muted font-normal">Z</th>
					</tr>
				</thead>
				<tbody>
					{blocks.map((b, i) => (
						<tr key={i} className="border-b border-deep hover:bg-elevated transition-colors">
							<td className="px-3 py-1.5 text-muted">{i + 1}</td>
							<td className="px-3 py-1.5 text-bolt-glow">{b.x}</td>
							<td className="px-3 py-1.5 text-arc">{b.z}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
