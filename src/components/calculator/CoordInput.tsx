export function CoordInput({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
}) {
	return (
		<label className="flex flex-col gap-1.5">
			<span className="text-xs text-text-secondary uppercase tracking-widest">{label}</span>
			<input
				type="number"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder="0"
				className="
					w-full px-3 py-2 rounded
					bg-deep border border-border
					text-text-primary font-mono text-sm
					focus:outline-none focus:border-bolt focus:shadow-[0_0_0_2px_rgba(168,85,247,0.2)]
					hover:border-muted
					transition-all placeholder:text-muted
					[-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
				"
			/>
		</label>
	);
}
