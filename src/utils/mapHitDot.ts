import { CHUNK_SIZE } from "@/consts";
import { BLOCK_SIZE } from "@/hooks/useMapInteraction";
import type { Coords } from "@/types/Coords";
import type { TooltipState } from "@/types/MapTypes";
import type { WorldToCanvas } from "@/utils/mapDrawHelpers";
import { getEndZone } from "@/utils/mapDrawHelpers";

/**
 * Hit-test radius in CSS pixels. A pointer is considered to hover over a dot
 * if the Euclidean distance between the pointer and the dot's canvas position
 * is less than this value.
 */
export const HIT_RADIUS = 14;

/**
 * Builds the {@link TooltipState} payload shown when the user hovers over a
 * significant point on the map (origin, destination or build block).
 *
 * @param coords          - World coordinates of the hovered point.
 * @param title           - Display title for the tooltip (e.g. `"Origin Gateway"`).
 * @param mx              - Horizontal pointer position in canvas pixels.
 * @param my              - Vertical pointer position in canvas pixels.
 * @param containerWidth  - CSS width of the canvas container used for
 *   left/right flip logic in the tooltip component.
 * @returns A fully populated {@link TooltipState} with `visible: true`.
 */
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
 * Performs a pure hit-test against the origin gateway, the final destination,
 * and all build-line blocks, returning a ready-to-set {@link TooltipState} on
 * the first match, or `null` when no dot was hit.
 *
 * @remarks
 * Build blocks are only tested when there is more than one block **and** when
 * `BLOCK_SIZE * zoom > 4` (i.e. blocks are visible at the current zoom level).
 * This avoids false positives when the map is zoomed far out.
 *
 * @param mx             - Horizontal pointer position relative to the canvas element.
 * @param my             - Vertical pointer position relative to the canvas element.
 * @param W              - Canvas width in pixels.
 * @param H              - Canvas height in pixels.
 * @param containerWidth - CSS width of the canvas container (for tooltip flip).
 * @param origin         - Origin gateway world coordinates.
 * @param final          - Destination world coordinates, or `null` when not yet
 *   calculated.
 * @param blocks         - Ordered list of build-path block coordinates.
 * @param zoom           - Current map zoom scale factor.
 * @param worldToCanvas  - Coordinate conversion function from
 *   {@link useMapInteraction}.
 * @returns A {@link TooltipState} with `visible: true` on hit, or `null` when
 *   nothing was hit.
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
