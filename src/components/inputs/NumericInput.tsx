import { useEffect, useState } from "react";

/** Props accepted by the {@link NumericInput} component. */
interface NumericInputProps {
	/** Current numeric value (controlled from the parent). */
	value: number;
	/** Minimum clamp boundary. No clamping applied when omitted. */
	min?: number;
	/** Maximum clamp boundary. No clamping applied when omitted. */
	max?: number;
	/**
	 * Callback invoked with the committed, clamped, and floor-rounded value.
	 * Called on blur and when the user presses Enter.
	 *
	 * @param n - The normalised integer value.
	 */
	onCommit: (n: number) => void;
	/** Optional extra CSS classes applied to the `<input>` element. */
	className?: string;
	/** Accessible label passed to `aria-label`. */
	ariaLabel?: string;
}

/**
 * Numeric input with commit-on-blur or Enter key press.
 *
 * @remarks
 * Maintains an internal draft string state so the user can type freely
 * without intermediate values propagating to the parent. On commit the
 * draft is parsed, clamped to `[min, max]`, floored, and passed to
 * `onCommit`. Invalid or empty input is discarded and the field reverts
 * to the last valid `value` prop.
 *
 * @param props - Component props; see {@link NumericInputProps}.
 * @returns A styled `<input type="number">` element.
 */
export function NumericInput({
	value,
	min,
	max,
	onCommit,
	className,
	ariaLabel,
}: NumericInputProps) {
	const [inputVal, setInputVal] = useState<string>(String(value));

	useEffect(() => {
		setInputVal(String(value));
	}, [value]);

	const commit = (val?: string) => {
		const s = (val ?? inputVal).trim();

		if (s === "") {
			setInputVal(String(value));
			return;
		}

		const n = Number(s);
		if (isNaN(n)) {
			setInputVal(String(value));
			return;
		}

		let clamped = n;
		if (typeof min === "number" && n < min) clamped = min;
		if (typeof max === "number" && n > max) clamped = max;

		onCommit(Math.floor(clamped));
		setInputVal(String(clamped));
	};

	return (
		<input
			type="number"
			min={min}
			max={max}
			value={inputVal}
			onChange={(e) => setInputVal(e.target.value)}
			onBlur={() => commit()}
			onKeyDown={(e) => {
				if (e.key === "Enter") commit();
			}}
			aria-label={ariaLabel}
			className={className}
		/>
	);
}
