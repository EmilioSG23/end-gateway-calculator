import { MAX_DISTANCE, MIN_DISTANCE } from "@/consts";
import { calculate, calculateAngle, calculateFinalCoords, drawLine } from "@/logic/calculate";
import { describe, expect, it } from "vitest";

const farlands = 30000000;
const farlandsCoords = { x: farlands, z: farlands };

describe("calculateAngle", () => {
	it("calculate correct angle for a given vector", () => {
		const coords = { x: 1, z: 1 };
		const angle = calculateAngle(coords);
		expect(angle).toBeCloseTo(Math.PI / 4);
	});
});

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
	it("generates line without consecutive duplicates due to rounding (from {768, 768} to {1024, 1024})", () => {
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
