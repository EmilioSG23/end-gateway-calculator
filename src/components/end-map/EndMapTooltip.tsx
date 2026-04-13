import type { TooltipState } from "@/types/MapTypes";

interface EndMapTooltipProps {
	tooltip: TooltipState;
}

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
