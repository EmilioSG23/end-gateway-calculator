/**
 * @file Unit tests for the core calculation logic in `src/logic/calculate.ts`.
 *
 * @remarks
 * Uses Vitest. All tests work with a `farlands` coordinate value of
 * `30_000_000` to approximate an infinitely far origin point so that the
 * resulting angle is very close to the exact diagonal / axis direction.
 */
import { MAX_DISTANCE, MIN_DISTANCE } from "@/consts";
import { calculate, calculateAngle, calculateFinalCoords, drawLine } from "@/logic/calculate";
import { describe, expect, it } from "vitest";

/** Coordinate value that approximates +infinity for angle calculations. */
const farlands = 30000000;
/** Convenience constant for a 45° diagonal origin. */
const farlandsCoords = { x: farlands, z: farlands };

/** Tests for {@link calculateAngle}. */
describe("calculateAngle", () => {
	it("calculate correct angle for a given vector", () => {
		const coords = { x: 1, z: 1 };
		const angle = calculateAngle(coords);
		expect(angle).toBeCloseTo(Math.PI / 4);
	});
});

/** Tests for {@link calculateFinalCoords}. */
describe("calculateFinalCoords", () => {
	it("calculates final coordinates correctly rounded", () => {
		const distance = 1000;
		const finalCoords = calculateFinalCoords({ coords: farlandsCoords, distance });
		expect(finalCoords).toEqual({ x: 707, z: 707 });
	});
	it("calculates final coordinates using minimum distance", () => {
		const finalCoords = calculateFinalCoords({ coords: farlandsCoords, distance: MIN_DISTANCE });
		expect(finalCoords).toEqual({ x: 543, z: 543 });
	});
	it("calculates final coordinates using maximum distance", () => {
		const finalCoords = calculateFinalCoords({ coords: farlandsCoords, distance: MAX_DISTANCE });
		expect(finalCoords).toEqual({ x: 724, z: 724 });
	});
});

/**
 * Tests for {@link drawLine} verifying deduplication of consecutive
 * integer positions that would otherwise repeat due to rounding.
 */
describe("draw line without consecutive duplicates due to rounding", () => {
	it("generates line without consecutive duplicates due to rounding (from {768, 0} to {1024, 0})", () => {
		const finalCoords = { x: 768, z: 0 };
		const expectedLine = [];
		for (let x = 768; x <= 1024; x++) {
			expectedLine.push({ x, z: 0 });
		}

		const angle = 0;
		const points = drawLine({ finalCoords, angle });
		expect(points).toEqual(expectedLine);
	});
	it("generates line without consecutive duplicates due to rounding (from {543, 543} to {724, 724})", () => {
		const minPoint = Math.round(768 / Math.sqrt(2));
		const maxPoint = Math.round(1024 / Math.sqrt(2));

		const finalCoords = { x: minPoint, z: minPoint };

		const expectedLine = [];
		for (let x = minPoint; x <= maxPoint; x++) {
			const z = x;
			expectedLine.push({ x, z });
		}

		const angle = calculateAngle({ x: 768, z: 768 });
		const points = drawLine({ finalCoords, angle });
		expect(points).toEqual(expectedLine);
	});
});

/**
 * Integration tests for {@link calculate}, which combines angle computation,
 * final-coordinate projection, and line drawing into a single call.
 * Verifies end-to-end correctness from an `initialCoords` + `distance` pair.
 */
describe("calculate line from an initial point", () => {
	it("calculates line from an initial point", () => {
		const initialCoords = { x: farlands, z: 0 };
		const distance = MIN_DISTANCE;
		const expectedLine = [];
		for (let x = 768; x <= 1024; x++) {
			expectedLine.push({ x, z: 0 });
		}

		const points = calculate({ coords: initialCoords, distance });
		expect(points).toEqual(expectedLine);
	});
	it("calculates line from an initial point with 45° angle", () => {
		const initialCoords = farlandsCoords;
		const distance = MIN_DISTANCE;

		const minPoint = Math.round(768 / Math.sqrt(2));
		const maxPoint = Math.round(1024 / Math.sqrt(2));

		const expectedLine = [];
		for (let x = minPoint; x <= maxPoint; x++) {
			const z = x;
			expectedLine.push({ x, z });
		}

		const points = calculate({ coords: initialCoords, distance });
		expect(points).toEqual(expectedLine);
	});
});
