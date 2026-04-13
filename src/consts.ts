import type { Coords } from "./types/Coords";

export const MAX_DISTANCE = 1024;
export const MIN_DISTANCE = 768;

export const END_GATEWAYS: Coords[] = [
	{ x: 96, z: 0 },
	{ x: 91, z: 30 },
	{ x: 78, z: 56 },
	{ x: 56, z: 78 },
	{ x: 30, z: 91 },
	{ x: 0, z: 96 },
	{ x: -30, z: 91 },
	{ x: -56, z: 78 },
	{ x: -78, z: 56 },
	{ x: -91, z: 30 },
	{ x: -96, z: 0 },
	{ x: -91, z: -30 },
	{ x: -78, z: -56 },
	{ x: -56, z: -78 },
	{ x: -30, z: -91 },
	{ x: 0, z: -96 },
	{ x: 30, z: -91 },
	{ x: 56, z: -78 },
	{ x: 78, z: -56 },
	{ x: 91, z: -30 },
];
