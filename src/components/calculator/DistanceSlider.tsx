import { NumericInput } from "@/components/inputs/NumericInput";
import { SliderInput } from "@/components/inputs/SliderInput";
import { MAX_DISTANCE, MIN_DISTANCE } from "@/consts";

/** Props accepted by the {@link DistanceSlider} component. */
interface DistanceSliderProps {
	/** Current distance value in blocks. */
	value: number;
	/** CSS `--slider-percent` value (0–100) used to fill the range track. */
	sliderPercent: number;
	/** Change handler for the numeric text input (receives a synthetic event). */
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	/** Change handler for the range slider `<input>`. */
	onSlider: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Combined distance control grouping a range slider and a numeric input.
 *
 * @remarks
 * Keeps both controls in sync: the slider updates via `onSlider` while the
 * numeric input fires `onChange` by fabricating a synthetic event when the
 * user commits a value. Both are clamped between {@link MIN_DISTANCE} and
 * {@link MAX_DISTANCE}.
 *
 * @param props - Component props; see {@link DistanceSliderProps}.
 * @returns A flex column containing the range labels, slider, and numeric input.
 */
export function DistanceSlider({ value, sliderPercent, onChange, onSlider }: DistanceSliderProps) {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<span className="text-[10px] text-muted">{MIN_DISTANCE} (min)</span>
				<span className="text-[10px] text-muted">{MAX_DISTANCE} (max)</span>
			</div>

			<SliderInput
				value={value}
				min={MIN_DISTANCE}
				max={MAX_DISTANCE}
				onChange={onSlider}
				sliderPercent={sliderPercent}
				ariaLabel="Target distance"
			/>

			<div className="flex items-center gap-2">
				<NumericInput
					value={value}
					min={MIN_DISTANCE}
					max={MAX_DISTANCE}
					onCommit={(n) => {
						const fake = {
							target: { value: String(n) },
						} as unknown as React.ChangeEvent<HTMLInputElement>;
						onChange(fake);
					}}
					ariaLabel="Target distance in blocks"
					className={
						"flex-1 px-3 py-2 rounded bg-deep border border-border text-text-primary font-mono text-sm text-center focus:outline-none focus:border-bolt focus:shadow-[0_0_0_2px_rgba(168,85,247,0.2)] transition-all [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
					}
				/>
				<span className="text-[10px] text-muted">blocks</span>
			</div>
		</div>
	);
}
