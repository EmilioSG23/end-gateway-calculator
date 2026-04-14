import type { Coords } from "@/types/Coords";

/** Props accepted by the {@link BlockList} component. */
interface BlockListProps {
	/** Ordered array of block coordinates to display. */
	blocks: Coords[];
}

/**
 * Scrollable table listing every block in the computed build path.
 *
 * @remarks
 * Returns `null` when `blocks` is empty, so the section is invisible when
 * no calculation has been performed. The table header is sticky so column
 * labels remain visible while scrolling through long paths. The container
 * uses CSS overflow scroll (not virtual rendering) and is capped at
 * `max-h-60`.
 *
 * @param props        - Component props; see {@link BlockListProps}.
 * @param props.blocks - Ordered list of coordinates to render.
 * @returns A scrollable table of `#`, `X`, `Z` rows, or `null`.
 */
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
