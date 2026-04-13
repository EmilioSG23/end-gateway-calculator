import { useEffect, useState } from "react";

interface NumericInputProps {
	value: number;
	min?: number;
	max?: number;
	onCommit: (n: number) => void;
	className?: string;
	ariaLabel?: string;
}

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
