import type { Coords } from "@/types/Coords";

export function calculate({ coords, distance }: { coords: Coords; distance: number }): Coords[] {
	const angle = calculateAngle(coords);
	const finalCoords = calculateFinalCoords({ coords, distance });
	return drawLine({ finalCoords, angle });
}

export function calculateAngle(coords: Coords): number {
	return Math.atan2(coords.z, coords.x);
}

export function calculateFinalCoords({
	coords,
	distance,
}: {
	coords: Coords;
	distance: number;
}): Coords {
	const angle = Math.atan2(coords.z, coords.x);
	const finalX = Math.round(distance * Math.cos(angle));
	const finalZ = Math.round(distance * Math.sin(angle));
	return { x: finalX, z: finalZ };
}

export function drawLine({
	finalCoords,
	angle,
	minDistance = 768,
	maxDistance = 1024,
}: {
	finalCoords: Coords;
	angle: number;
	minDistance?: number;
	maxDistance?: number;
}): Coords[] {
	const points: Coords[] = [];

	const radial = Math.round(Math.hypot(finalCoords.x, finalCoords.z));
	const startR = Math.max(1, Math.round(minDistance ?? radial));

	let lastX: number | null = null;
	let lastZ: number | null = null;

	for (let r = startR; r <= maxDistance; r++) {
		const x = Math.round(r * Math.cos(angle));
		const z = Math.round(r * Math.sin(angle));

		if (x === lastX && z === lastZ) continue;

		points.push({ x, z });
		lastX = x;
		lastZ = z;
	}

	return points;
}
