import { MAX_DISTANCE, MEDIUM_DISTANCE, MIN_DISTANCE } from "@/consts";
import { calculate, calculateAngle, calculateFinalCoords } from "@/logic/calculate";
import type { DOWNLOAD_FORMAT } from "@/services/download";
import { downloadBlockList as download } from "@/services/download";
import type { Coords } from "@/types/Coords";
import { useCallback, useMemo, useState } from "react";

/**
 * All state values and action handlers exposed by {@link useGatewayCalculator}.
 */
export interface GatewayCalculatorState {
	/** Controlled string value of the origin X input (allows empty/partial input). */
	originX: string;
	/** Controlled string value of the origin Z input (allows empty/partial input). */
	originZ: string;
	/** Currently selected target distance in blocks. */
	distance: number;
	/** Parsed origin coordinates derived from `originX` and `originZ`. */
	origin: Coords;
	/** `true` when at least one of the origin axes is non-zero. */
	hasNonZeroOrigin: boolean;
	/** Bearing angle from world (0, 0) toward the origin, in radians. */
	angleRad: number;
	/** Same angle expressed in degrees. */
	angleDeg: number;
	/** Destination coordinates projected at `distance` along the angle, or
	 * `null` when the origin is (0, 0). */
	finalCoords: Coords | null;
	/** Ordered list of block coordinates that form the build path. Empty when
	 * the origin is (0, 0). */
	blocks: Coords[];
	/** Percentage (0–100) of the distance slider, used for the custom styled
	 * range track fill. */
	sliderPercent: number;
	/** Setter for the raw X-axis string input. */
	setOriginX: (v: string) => void;
	/** Setter for the raw Z-axis string input. */
	setOriginZ: (v: string) => void;
	/**
	 * Change handler wired to the numeric distance `<input>`. Clamps the
	 * parsed value between {@link MIN_DISTANCE} and {@link MAX_DISTANCE}.
	 *
	 * @param e - The native input change event.
	 */
	handleDistanceInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
	/**
	 * Change handler wired to the range `<input>` slider. Updates `distance`
	 * directly from the slider value.
	 *
	 * @param e - The native input change event.
	 */
	handleSlider: (e: React.ChangeEvent<HTMLInputElement>) => void;
	/**
	 * Triggers a file download of the computed block list in the requested
	 * format.
	 *
	 * @param format - One of the {@link DOWNLOAD_FORMAT} values.
	 * @returns A promise that resolves when the download has been initiated.
	 */
	downloadBlockList: (format: DOWNLOAD_FORMAT) => Promise<void>;
}

/**
 * Core application state hook for the End Gateway Calculator.
 *
 * @remarks
 * Manages the origin coordinates and distance inputs, and derives all
 * calculated values (angle, final coordinates, block list) reactively via
 * `useMemo`. Stable callback references are guaranteed via `useCallback`
 * for handlers that are passed to child components.
 *
 * @returns A {@link GatewayCalculatorState} object with current state and
 *   all action handlers.
 */
export function useGatewayCalculator(): GatewayCalculatorState {
	const [originX, setOriginX] = useState<string>("0");
	const [originZ, setOriginZ] = useState<string>("0");
	const [distance, setDistance] = useState<number>(MEDIUM_DISTANCE);

	const origin: Coords = useMemo(
		() => ({
			x: parseInt(originX) || 0,
			z: parseInt(originZ) || 0,
		}),
		[originX, originZ],
	);

	const hasNonZeroOrigin = origin.x !== 0 || origin.z !== 0;

	const angleRad = useMemo(() => calculateAngle(origin), [origin]);
	const angleDeg = useMemo(() => (angleRad * 180) / Math.PI, [angleRad]);

	const finalCoords = useMemo(() => {
		if (!hasNonZeroOrigin) return null;
		return calculateFinalCoords({ coords: origin, distance });
	}, [origin, distance, hasNonZeroOrigin]);

	const blocks = useMemo(() => {
		if (!hasNonZeroOrigin) return [];
		return calculate({ coords: origin, distance });
	}, [origin, distance, hasNonZeroOrigin]);

	const handleDistanceInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const v = Number(e.target.value);
		if (!isNaN(v)) setDistance(Math.min(MAX_DISTANCE, Math.max(MIN_DISTANCE, v)));
	}, []);

	const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setDistance(Number(e.target.value));
	}, []);

	const sliderPercent = ((distance - MIN_DISTANCE) / (MAX_DISTANCE - MIN_DISTANCE)) * 100;

	const downloadBlockList = useCallback(
		async (format: DOWNLOAD_FORMAT) => {
			await download({ blocks, origin, distance, format });
		},
		[blocks, origin, distance],
	);

	return {
		originX,
		originZ,
		distance,
		origin,
		hasNonZeroOrigin,
		angleRad,
		angleDeg,
		finalCoords,
		blocks,
		sliderPercent,
		setOriginX,
		setOriginZ,
		handleDistanceInput,
		handleSlider,
		downloadBlockList,
	};
}
