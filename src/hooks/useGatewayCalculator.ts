import { MAX_DISTANCE, MEDIUM_DISTANCE, MIN_DISTANCE } from "@/consts";
import { calculate, calculateAngle, calculateFinalCoords } from "@/logic/calculate";
import type { DOWNLOAD_FORMAT } from "@/services/download";
import { downloadBlockList as download } from "@/services/download";
import type { Coords } from "@/types/Coords";
import { useCallback, useMemo, useState } from "react";

export interface GatewayCalculatorState {
	originX: string;
	originZ: string;
	distance: number;
	origin: Coords;
	hasNonZeroOrigin: boolean;
	angleRad: number;
	angleDeg: number;
	finalCoords: Coords | null;
	blocks: Coords[];
	sliderPercent: number;
	setOriginX: (v: string) => void;
	setOriginZ: (v: string) => void;
	handleDistanceInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleSlider: (e: React.ChangeEvent<HTMLInputElement>) => void;
	downloadBlockList: (format: DOWNLOAD_FORMAT) => Promise<void>;
}

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
