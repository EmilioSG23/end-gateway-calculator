/**
 * Displays a single labelled metric card.
 *
 * @remarks
 * Used in the statistics row of the calculator panel to show derived values
 * such as angle, distance, and destination coordinates. When `accent` is
 * `true`, the card uses the accent border and highlight colour to draw
 * attention to the primary stat.
 *
 * @param props        - Component props.
 * @param props.label  - Short uppercase label shown above the value.
 * @param props.value  - The metric value string to display.
 * @param props.accent - When `true`, applies accent styling. Defaults to `false`.
 * @returns A styled stat card `<div>`.
 */
export function StatCard({
	label,
	value,
	accent = false,
}: {
	label: string;
	value: string;
	accent?: boolean;
}) {
	return (
		<div
			className={`rounded p-3 border ${accent ? "border-purpur-dim bg-elevated" : "border-[#1e1e38] bg-surface"}`}
		>
			<p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">{label}</p>
			<p
				className={`font-mono text-sm break-all ${accent ? "text-bolt-glow" : "text-text-primary"}`}
			>
				{value}
			</p>
		</div>
	);
}
