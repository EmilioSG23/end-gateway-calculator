/** Props accepted by the {@link SliderInput} component. */
interface SliderInputProps {
	/** Current slider value. */
	value: number;
	/** Minimum allowed value. Defaults to `0`. */
	min?: number;
	/** Maximum allowed value. Defaults to `100`. */
	max?: number;
	/** Change handler wired to the hidden `<input type="range">`. */
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	/** Pre-computed fill percentage (0–100). When omitted it is derived from
	 * `value`, `min`, and `max`. Useful when the parent uses a non-linear scale. */
	sliderPercent?: number;
	/** Optional extra CSS classes applied to the outer container `<div>`. */
	className?: string;
	/** Accessible label passed to `aria-label` on the range `<input>`. */
	ariaLabel?: string;
}

/**
 * Custom-styled range slider with a gradient fill track and a glowing thumb.
 *
 * @remarks
 * The native `<input type="range">` is rendered with `opacity-0` over the
 * visual track so the browser handles all pointer and keyboard interactions
 * while the custom thumb and fill layer provide the visual presentation.
 *
 * @param props - Component props; see {@link SliderInputProps}.
 * @returns A `<div>` with a custom-drawn track and an invisible native range input.
 */
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
