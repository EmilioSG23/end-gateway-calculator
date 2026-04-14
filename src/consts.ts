import type { Coords } from "@/types/Coords";

/** Maximum allowed target distance in blocks (hard upper bound for the slider). */
export const MAX_DISTANCE = 1280;

/**
 * Suggested "medium" target distance in blocks.
 * Used as the default initial distance value in {@link useGatewayCalculator}.
 */
export const MEDIUM_DISTANCE = 1024;

/** Minimum allowed target distance in blocks (hard lower bound for the slider). */
export const MIN_DISTANCE = 768;

/** Size of one Minecraft chunk in blocks. Used for the chunk grid overlay. */
export const CHUNK_SIZE = 16;

/**
 * URL of the project's GitHub repository.
 * The GitHub button in the header is hidden when this value is an empty string.
 */
export const GIT_HUB_URL = "https://github.com/EmilioSG23/end-gateway-calculator";

/**
 * Predefined world coordinates of all 20 End Gateways that spawn after
 * defeating the Ender Dragon.
 *
 * @remarks
 * These coordinates are deterministic and consistent across all Minecraft
 * Java Edition worlds. They are rendered as ring dots on the End Map.
 */
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
