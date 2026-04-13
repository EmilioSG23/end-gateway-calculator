import type { Coords } from "./types/Coords";

export const MAX_DISTANCE = 1024;
export const MIN_DISTANCE = 768;

export const END_GATEWAYS: Coords[] = [
	{ x: 96, z: 0 },
	{ x: 91, z: 29 },
	{ x: 77, z: 56 },
	{ x: 56, z: 77 },
	{ x: 29, z: 91 },
	{ x: -1, z: 96 },
	{ x: -30, z: 91 },
	{ x: -57, z: 78 },
	{ x: -78, z: 56 },
	{ x: -92, z: 29 },
	{ x: -96, z: -1 },
	{ x: -92, z: -30 },
	{ x: -78, z: -57 },
	{ x: -57, z: -78 },
	{ x: -30, z: -92 },
	{ x: 0, z: -96 },
	{ x: 29, z: -92 },
	{ x: 56, z: -78 },
	{ x: 77, z: -57 },
	{ x: 91, z: -30 },
];
