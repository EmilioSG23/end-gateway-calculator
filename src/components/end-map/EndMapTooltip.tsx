import type { TooltipState } from "@/types/MapTypes";

/** Props accepted by the {@link EndMapTooltip} component. */
interface EndMapTooltipProps {
	/** Current tooltip state. The tooltip renders nothing when `visible` is `false`. */
	tooltip: TooltipState;
}

/**
 * Displays a floating tooltip over a hovered dot on the End Map canvas.
 *
 * @remarks
 * Positioned absolutely so it must be placed inside a `position: relative`
 * container. The horizontal position is flipped when the dot is in the
 * right 60% of the canvas to avoid overflowing the edge.
 * Returns `null` when `tooltip.visible` is `false`.
 *
 * @param props         - Component props; see {@link EndMapTooltipProps}.
 * @returns A positioned `<div>` with the tooltip card, or `null`.
 */
export function EndMapTooltip({ tooltip }: EndMapTooltipProps) {
	if (!tooltip.visible) return null;

	return (
		<div
			className="absolute z-20 pointer-events-none"
			style={{
				left: tooltip.x > tooltip.containerWidth * 0.6 ? tooltip.x - 180 : tooltip.x + 16,
				top: Math.max(8, tooltip.y - 8),
			}}
		>
			<div className="bg-deep/95 border border-border rounded px-3 py-2 text-[11px] min-w-42 backdrop-blur-sm shadow-lg shadow-black/40">
				<div className="text-text-primary font-medium mb-1.5 font-mono">{tooltip.title}</div>
				{tooltip.rows.map((r) => (
					<div key={r.label} className="flex justify-between gap-4 leading-5">
						<span className="text-text-muted">{r.label}</span>
						<span className="text-text-secondary font-mono">{r.value}</span>
					</div>
				))}
			</div>
		</div>
	);
}
