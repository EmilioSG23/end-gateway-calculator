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
