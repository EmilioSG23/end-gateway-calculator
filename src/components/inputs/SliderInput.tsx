interface SliderInputProps {
	value: number;
	min?: number;
	max?: number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	sliderPercent?: number;
	className?: string;
	ariaLabel?: string;
}

export function SliderInput({
	value,
	min = 0,
	max = 100,
	onChange,
	sliderPercent,
	className,
	ariaLabel,
}: SliderInputProps) {
	const pct =
		typeof sliderPercent === "number" ? sliderPercent : ((value - min) / (max - min)) * 100;

	return (
		<div className={`relative h-6 flex items-center ${className ?? ""}`}>
			<div className="absolute inset-x-0 h-1 rounded-full bg-[#1e1e38]" />
			<div
				className="absolute left-0 h-1 rounded-full bg-linear-to-r from-purpur-dim to-bolt"
				style={{ width: `${pct}%` }}
			/>
			<input
				type="range"
				min={min}
				max={max}
				value={value}
				onChange={onChange}
				className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
				aria-label={ariaLabel}
			/>
			<div
				className="absolute w-4 h-4 rounded-full bg-bolt border-2 border-bolt-bright shadow-[0_0_12px_#a855f7] pointer-events-none"
				style={{ left: `calc(${pct}% - 8px)` }}
			/>
		</div>
	);
}
