import type { Coords } from "@/types/Coords";

/**
 * Calculates the full ordered list of block coordinates that form the build
 * line from the minimum gateway distance up to `distance` along the angle
 * defined by `coords`.
 *
 * @remarks
 * This is the main entry point that orchestrates {@link calculateAngle},
 * {@link calculateFinalCoords}, and {@link drawLine}.
 *
 * @param params - Input parameters.
 * @param params.coords - Origin gateway coordinates used to derive the angle.
 * @param params.distance - Target distance in blocks from world centre (0, 0).
 * @returns Ordered array of {@link Coords} representing each distinct block on
 *   the path from the minimum gateway radius to `distance`.
 */
export function calculate({ coords, distance }: { coords: Coords; distance: number }): Coords[] {
	const angle = calculateAngle(coords);
	const finalCoords = calculateFinalCoords({ coords, distance });
	return drawLine({ finalCoords, angle, minDistance: distance });
}

/**
 * Computes the bearing angle (in radians) from the world origin toward the
 * given coordinates using `Math.atan2`.
 *
 * @param coords - A point in the End dimension.
 * @returns Angle in radians in the range **[-π, π]**.
 */
export function calculateAngle(coords: Coords): number {
	return Math.atan2(coords.z, coords.x);
}

/**
 * Projects a point at `distance` blocks from the world origin (0, 0) along
 * the same angle as `coords`, rounding each axis to the nearest block.
 *
 * @param params - Input parameters.
 * @param params.coords - Directional reference point (e.g. gateway position).
 * @param params.distance - Desired radial distance from the world origin in
 *   blocks.
 * @returns The destination {@link Coords} rounded to the nearest block.
 */
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

/**
 * Traces an integer-step radial line from `minDistance` to `maxDistance`
 * along `angle`, deduplicating consecutive positions that map to the same
 * block after rounding.
 *
 * @remarks
 * The algorithm increments the radial distance `r` by 1 block each iteration
 * and converts to Cartesian coordinates using `Math.cos` / `Math.sin`. Points
 * that are identical to the previous one (due to rounding) are silently
 * skipped, ensuring the returned list contains only visually distinct blocks.
 *
 * @param params - Input parameters.
 * @param params.finalCoords - Destination coordinates (used only to infer the
 *   natural radial extent; the actual traversal is driven by `minDistance` and
 *   `maxDistance`).
 * @param params.angle - Direction angle in radians.
 * @param params.minDistance - Starting radius in blocks. Defaults to `768`.
 * @param params.maxDistance - Ending radius in blocks (inclusive). Defaults to
 *   `1024`.
 * @returns Deduplicated ordered array of {@link Coords} along the line.
 */
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
