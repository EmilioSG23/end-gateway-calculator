import { BLOCK_SIZE } from "@/hooks/useMapInteraction";
import type { Coords } from "@/types/Coords";
import type { TooltipState } from "@/types/MapTypes";
import { getEndZone } from "@/utils/mapDrawHelpers";
import type { WorldToCanvas } from "@/utils/mapDrawHelpers";
import { CHUNK_SIZE } from "@/consts";

export const HIT_RADIUS = 14;

function buildTooltipPayload(
	coords: Coords,
	title: string,
	mx: number,
	my: number,
	containerWidth: number,
): TooltipState {
	const dist = Math.round(Math.hypot(coords.x, coords.z));
	return {
		visible: true,
		x: mx,
		y: my,
		containerWidth,
		title,
		rows: [
			{ label: "Coords", value: `${coords.x}, ${coords.z}` },
			{
				label: "Chunk",
				value: `${Math.floor(coords.x / CHUNK_SIZE)}, ${Math.floor(coords.z / CHUNK_SIZE)}`,
			},
			{ label: "Distance", value: `${dist} blocks` },
			{ label: "Zone", value: getEndZone(coords.x, coords.z) },
		],
	};
}

/**
 * Pure hit-test against origin, final destination and build-line blocks.
 * Returns a ready-to-set TooltipState on hit, or null when nothing was hit.
 */
export function hitDot(
	mx: number,
	my: number,
	W: number,
	H: number,
	containerWidth: number,
	origin: Coords,
	final: Coords | null,
	blocks: Coords[],
	zoom: number,
	worldToCanvas: WorldToCanvas,
): TooltipState | null {
	const { cx: ox, cy: oz } = worldToCanvas(origin.x, origin.z, W, H);
	if (Math.hypot(mx - ox, my - oz) < HIT_RADIUS) {
		return buildTooltipPayload(origin, "Origin Gateway", mx, my, containerWidth);
	}

	if (final) {
		const { cx: fx, cy: fz } = worldToCanvas(final.x, final.z, W, H);
		if (Math.hypot(mx - fx, my - fz) < HIT_RADIUS) {
			return buildTooltipPayload(final, "Destination", mx, my, containerWidth);
		}
	}

	if (blocks.length > 1 && BLOCK_SIZE * zoom > 4) {
		for (let i = 0; i < blocks.length; i++) {
			const { cx, cy } = worldToCanvas(blocks[i].x, blocks[i].z, W, H);
			if (Math.hypot(mx - cx, my - cy) < HIT_RADIUS) {
				return buildTooltipPayload(blocks[i], `Build Block #${i + 1}`, mx, my, containerWidth);
			}
		}
	}

	return null;
}
