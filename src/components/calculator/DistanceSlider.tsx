import { MAX_DISTANCE, MIN_DISTANCE } from "@/consts";

interface DistanceSliderProps {
	value: number;
	sliderPercent: number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onSlider: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DistanceSlider({ value, sliderPercent, onChange, onSlider }: DistanceSliderProps) {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<span className="text-[10px] text-muted">{MIN_DISTANCE} (min)</span>
				<span className="text-[10px] text-muted">{MAX_DISTANCE} (max)</span>
			</div>

			<div className="relative h-6 flex items-center">
				<div className="absolute inset-x-0 h-1 rounded-full bg-[#1e1e38]" />
				<div
					className="absolute left-0 h-1 rounded-full bg-linear-to-r from-purpur-dim to-bolt"
					style={{ width: `${sliderPercent}%` }}
				/>
				<input
					type="range"
					min={MIN_DISTANCE}
					max={MAX_DISTANCE}
					value={value}
					onChange={onSlider}
					className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
					aria-label="Target distance"
				/>
				<div
					className="absolute w-4 h-4 rounded-full bg-bolt border-2 border-bolt-bright shadow-[0_0_12px_#a855f7] pointer-events-none"
					style={{ left: `calc(${sliderPercent}% - 8px)` }}
				/>
			</div>

			<div className="flex items-center gap-2">
				<input
					type="number"
					min={MIN_DISTANCE}
					max={MAX_DISTANCE}
					value={value}
					onChange={onChange}
					aria-label="Target distance in blocks"
					className="
						flex-1 px-3 py-2 rounded
						bg-deep border border-border
						text-text-primary font-mono text-sm text-center
						focus:outline-none focus:border-bolt focus:shadow-[0_0_0_2px_rgba(168,85,247,0.2)]
						transition-all
						[-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
					"
				/>
				<span className="text-[10px] text-muted">blocks</span>
			</div>
		</div>
	);
}
