import { BLOCK_SIZE } from "@/hooks/useMapInteraction";
import type { Coords } from "@/types/Coords";

/** Approximate radius of the central End island (blocks). */
export const END_ISLAND_RADIUS = 100;
/** Distance at which outer islands begin (blocks). */
export const END_OUTER_START = 1000;

/** Endstone base colors with different opacities for zones. */
const ENDSTONE_CENTER = "rgba(200,192,122,0.15)"; // central island (light)
const ENDSTONE_OUTER = "rgba(200,192,122,0.10)"; // outer islands (dense)
const ENDSTONE_BORDER = "rgba(120,100,50,0.85)"; // border stroke for zones

/**
 * Function signature for the coordinate-space conversion utility returned by
 * {@link useMapInteraction}. Converts world block coordinates into canvas
 * pixel coordinates accounting for the current zoom level and pan offset.
 *
 * @param wx - World X coordinate in blocks.
 * @param wz - World Z coordinate in blocks.
 * @param w  - Canvas width in pixels.
 * @param h  - Canvas height in pixels.
 * @returns Object with `cx` (canvas X) and `cy` (canvas Y) pixel values.
 */
export type WorldToCanvas = (
	wx: number,
	wz: number,
	w: number,
	h: number,
) => { cx: number; cy: number };

/**
 * Classifies an End dimension position into one of three named zones based on
 * its radial distance from the world origin.
 *
 * @param x - Block X coordinate.
 * @param z - Block Z coordinate.
 * @returns Human-readable zone name: `"Central Island"`, `"Void"`, or
 *   `"Outer Islands"`.
 */
export function getEndZone(x: number, z: number): string {
	const r = Math.hypot(x, z);
	if (r < END_ISLAND_RADIUS) return "Central Island";
	if (r < END_OUTER_START) return "Void";
	return "Outer Islands";
}

/**
 * Fills the canvas with the three End dimension zones using endstone/25 tinting:
 *  - Central island  (0 – 70 blocks)
 *  - Void            (70 – 1000 blocks)  — left dark
 *  - Outer islands   (1000+ blocks)
 */
export function drawEndZones(
	ctx: CanvasRenderingContext2D,
	W: number,
	H: number,
	originX: number,
	originY: number,
	zoom: number,
): void {
	const outerR = END_OUTER_START * BLOCK_SIZE * zoom;
	const islandR = END_ISLAND_RADIUS * BLOCK_SIZE * zoom;

	ctx.save();

	// Outer islands: fill everything outside the 1000-block radius using even-odd.
	ctx.beginPath();
	ctx.rect(0, 0, W, H);
	ctx.arc(originX, originY, outerR, 0, Math.PI * 2, true); // make a hole for the inner area
	ctx.fillStyle = ENDSTONE_OUTER;
	ctx.fill("evenodd");

	// Central island: lighter, semi-transparent fill
	ctx.beginPath();
	ctx.arc(originX, originY, islandR, 0, Math.PI * 2);
	ctx.fillStyle = ENDSTONE_CENTER;
	ctx.fill();

	// Stroke zone borders with smooth arcs (no pixelated block border)
	ctx.strokeStyle = ENDSTONE_BORDER;
	ctx.lineWidth = Math.max(1, 1.5 * zoom);
	ctx.beginPath();
	ctx.arc(originX, originY, outerR, 0, Math.PI * 2);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(originX, originY, islandR, 0, Math.PI * 2);
	ctx.stroke();

	ctx.restore();
}

/**
 * Draws a small compass rose in the top-right corner of the canvas showing
 * the +X, +Z, -X and -Z axis directions that match the Minecraft coordinate
 * system used throughout the map.
 *
 * @param ctx - The 2D rendering context of the target canvas.
 * @param W   - Total canvas width in pixels (used to position the rose).
 */
export function drawCompass(ctx: CanvasRenderingContext2D, W: number): void {
	const cx = W - 44;
	const cy = 44;
	const r = 22;

	ctx.save();
	ctx.globalAlpha = 0.7;
	ctx.strokeStyle = "#6a62a0";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.arc(cx, cy, r, 0, Math.PI * 2);
	ctx.stroke();

	const dirs = [
		{ label: "+X", angle: 0 },
		{ label: "+Z", angle: Math.PI / 2 },
		{ label: "-X", angle: Math.PI },
		{ label: "-Z", angle: -Math.PI / 2 },
	] as const;

	for (const d of dirs) {
		const x = cx + Math.cos(d.angle) * (r - 6);
		const y = cy + Math.sin(d.angle) * (r - 6);
		ctx.font = "9px 'Share Tech Mono', monospace";
		ctx.fillStyle = "#c4bce8";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(d.label, x, y);
	}
	ctx.restore();
}

/**
 * Draws the chunk-boundary grid lines (every 16 blocks) on the canvas.
 *
 * @remarks
 * This is extracted from {@link drawGrid} so the main grid function stays
 * focused. The alpha of the lines is scaled with `zoom` so they fade out
 * when too many lines would overlap at low zoom levels.
 *
 * @param ctx     - The 2D rendering context of the target canvas.
 * @param W       - Canvas width in pixels.
 * @param H       - Canvas height in pixels.
 * @param originX - Canvas X pixel corresponding to world coordinate (0, 0).
 * @param originY - Canvas Y pixel corresponding to world coordinate (0, 0).
 * @param zoom    - Current zoom scale factor.
 */
export function drawChunksGrid(
	ctx: CanvasRenderingContext2D,
	W: number,
	H: number,
	originX: number,
	originY: number,
	zoom: number,
): void {
	const chunkSizePx = 16 * BLOCK_SIZE * zoom;
	const chunkAlpha = Math.min(0.6, Math.max(0.1, chunkSizePx / 80));
	ctx.strokeStyle = `rgba(75,60,115,${chunkAlpha})`;
	ctx.lineWidth = Math.max(0.5, Math.min(1.5, zoom));
	ctx.beginPath();
	const startChunkCol = Math.floor(-originX / chunkSizePx);
	const endChunkCol = Math.ceil((W - originX) / chunkSizePx);
	for (let col = startChunkCol; col <= endChunkCol; col++) {
		const x = originX + col * chunkSizePx;
		ctx.moveTo(x, 0);
		ctx.lineTo(x, H);
	}
	const startChunkRow = Math.floor(-originY / chunkSizePx);
	const endChunkRow = Math.ceil((H - originY) / chunkSizePx);
	for (let row = startChunkRow; row <= endChunkRow; row++) {
		const y = originY + row * chunkSizePx;
		ctx.moveTo(0, y);
		ctx.lineTo(W, y);
	}
	ctx.stroke();
}

/**
 * Draws the full background grid for the End Map including the per-block
 * lines, chunk-boundary lines, and the two main axes (X and Z).
 *
 * @remarks
 * The per-block grid is only rendered when `BLOCK_SIZE * zoom` is large
 * enough to be visible. Chunk boundaries are skipped at very low zoom levels
 * (when `chunkSizePx < 4`) to avoid visual noise.
 *
 * @param ctx - The 2D rendering context of the target canvas.
 * @param W   - Canvas width in pixels.
 * @param H   - Canvas height in pixels.
 * @param zoom - Current zoom scale factor.
 * @param pan  - Current pan offset in **world** blocks (`{ x, y }`).
 * @returns The canvas-space pixel coordinates of the world origin
 *   `{ originX, originY }`, which are needed by downstream draw functions.
 */
export function drawGrid(
	ctx: CanvasRenderingContext2D,
	W: number,
	H: number,
	zoom: number,
	pan: { x: number; y: number },
): { originX: number; originY: number } {
	const blockSizePx = BLOCK_SIZE * zoom;
	const chunkSizePx = 16 * BLOCK_SIZE * zoom;
	const originX = W / 2 + pan.x * zoom;
	const originY = H / 2 + pan.y * zoom;
	const showChunkGrid = chunkSizePx >= 4;

	// Block grid lines — skip chunk-boundary columns when chunk grid is rendered
	const blockAlpha = Math.min(0.3, Math.max(0.03, blockSizePx / 80));
	ctx.strokeStyle = `rgba(42,42,74,${blockAlpha})`;
	ctx.lineWidth = 0.5;
	ctx.beginPath();
	const startCol = Math.floor(-originX / blockSizePx);
	const endCol = Math.ceil((W - originX) / blockSizePx);
	for (let col = startCol; col <= endCol; col++) {
		if (showChunkGrid && col % 16 === 0) continue; // drawn by chunk grid pass
		const x = originX + col * blockSizePx;
		ctx.moveTo(x, 0);
		ctx.lineTo(x, H);
	}
	const startRow = Math.floor(-originY / blockSizePx);
	const endRow = Math.ceil((H - originY) / blockSizePx);
	for (let row = startRow; row <= endRow; row++) {
		if (showChunkGrid && row % 16 === 0) continue;
		const y = originY + row * blockSizePx;
		ctx.moveTo(0, y);
		ctx.lineTo(W, y);
	}
	ctx.stroke();

	// Chunk grid lines (every 16 blocks) — draw via helper
	if (showChunkGrid) {
		drawChunksGrid(ctx, W, H, originX, originY, zoom);
	}

	// Axis lines (always visible)
	ctx.strokeStyle = "rgba(130, 112, 172, 0.75)";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(originX, 0);
	ctx.lineTo(originX, H);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(0, originY);
	ctx.lineTo(W, originY);
	ctx.stroke();

	return { originX, originY };
}

/**
 * Draws dashed circular rings at the minimum (768 blocks) and maximum (1024
 * blocks) valid gateway build-line distances. These act as visual reference
 * boundaries on the End Map.
 *
 * @param ctx     - The 2D rendering context of the target canvas.
 * @param originX - Canvas X pixel corresponding to world coordinate (0, 0).
 * @param originY - Canvas Y pixel corresponding to world coordinate (0, 0).
 * @param zoom    - Current zoom scale factor.
 */
export function drawGatewayRings(
	ctx: CanvasRenderingContext2D,
	originX: number,
	originY: number,
	zoom: number,
): void {
	const minR = 768 * BLOCK_SIZE * zoom;
	const maxR = 1024 * BLOCK_SIZE * zoom;

	ctx.save();
	ctx.setLineDash([4, 8]);
	ctx.strokeStyle = "rgba(168,85,247,0.35)";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.arc(originX, originY, minR, 0, Math.PI * 2);
	ctx.stroke();

	ctx.strokeStyle = "rgba(168,85,247,0.22)";
	ctx.beginPath();
	ctx.arc(originX, originY, maxR, 0, Math.PI * 2);
	ctx.stroke();

	ctx.restore();
}

/**
 * Renders the computed path of build blocks as a glowing polyline. When the
 * zoom is high enough each individual block is also rendered as a small filled
 * square to match the Minecraft block grid.
 *
 * @param ctx           - The 2D rendering context of the target canvas.
 * @param blocks        - Ordered list of block coordinates returned by
 *   {@link calculate}.
 * @param worldToCanvas - Coordinate conversion function from
 *   {@link useMapInteraction}.
 * @param W             - Canvas width in pixels.
 * @param H             - Canvas height in pixels.
 * @param zoom          - Current zoom scale factor.
 */
export function drawBuildLine(
	ctx: CanvasRenderingContext2D,
	blocks: Coords[],
	worldToCanvas: WorldToCanvas,
	W: number,
	H: number,
	zoom: number,
): void {
	if (blocks.length <= 1) return;

	const gridStep = BLOCK_SIZE * zoom;

	ctx.save();
	ctx.strokeStyle = "rgba(168,85,247,0.55)";
	ctx.lineWidth = Math.max(1, 2 * zoom);
	ctx.shadowColor = "#a855f7";
	ctx.shadowBlur = 8 * zoom;
	ctx.beginPath();
	for (let i = 0; i < blocks.length; i++) {
		const { cx, cy } = worldToCanvas(blocks[i].x, blocks[i].z, W, H);
		if (i === 0) ctx.moveTo(cx, cy);
		else ctx.lineTo(cx, cy);
	}
	ctx.stroke();
	ctx.restore();

	if (gridStep > 4) {
		for (const b of blocks) {
			const { cx, cy } = worldToCanvas(b.x, b.z, W, H);
			const halfSize = Math.max(1.5, 2.5 * zoom);
			ctx.fillStyle = "#c084fc";
			ctx.fillRect(cx - halfSize, cy - halfSize, halfSize * 2, halfSize * 2);
		}
	}
}

/**
 * Draws the destination point (calculated final coordinates) and a dashed
 * direction ray from the world origin (0, 0) to the destination.
 *
 * @remarks
 * Renders a radial gradient glow, a filled square marker, and a coordinate
 * label when zoom is high enough. The ray helps users visually confirm the
 * angle on the map.
 *
 * @param ctx           - The 2D rendering context of the target canvas.
 * @param final         - Destination world coordinates.
 * @param worldToCanvas - Coordinate conversion function from
 *   {@link useMapInteraction}.
 * @param W             - Canvas width in pixels.
 * @param H             - Canvas height in pixels.
 * @param zoom          - Current zoom scale factor.
 * @param originX       - Canvas X pixel corresponding to world coordinate (0, 0).
 * @param originY       - Canvas Y pixel corresponding to world coordinate (0, 0).
 */
export function drawFinalPoint(
	ctx: CanvasRenderingContext2D,
	final: Coords,
	worldToCanvas: WorldToCanvas,
	W: number,
	H: number,
	zoom: number,
	originX: number,
	originY: number,
): void {
	const gridStep = BLOCK_SIZE * zoom;
	const { cx: fx, cy: fz } = worldToCanvas(final.x, final.z, W, H);

	ctx.save();
	ctx.setLineDash([6, 6]);
	ctx.strokeStyle = "rgba(125,211,252,0.4)";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(originX, originY);
	ctx.lineTo(fx, fz);
	ctx.stroke();
	ctx.restore();

	const glowGrad = ctx.createRadialGradient(fx, fz, 0, fx, fz, 18 * zoom);
	glowGrad.addColorStop(0, "#e0aaff");
	glowGrad.addColorStop(0.4, "#a855f7aa");
	glowGrad.addColorStop(1, "transparent");
	ctx.beginPath();
	ctx.arc(fx, fz, 18 * zoom, 0, Math.PI * 2);
	ctx.fillStyle = glowGrad;
	ctx.fill();

	const halfSize = Math.max(3, 5 * zoom);
	ctx.fillStyle = "#e0aaff";
	ctx.shadowColor = "#c084fc";
	ctx.shadowBlur = 16;
	ctx.fillRect(fx - halfSize, fz - halfSize, halfSize * 2, halfSize * 2);
	ctx.shadowBlur = 0;

	if (gridStep > 3) {
		ctx.font = `${Math.max(10, 11 * zoom)}px "Share Tech Mono", monospace`;
		ctx.fillStyle = "#e0aaff";
		ctx.fillText(`(${final.x}, ${final.z})`, fx + 8 * zoom, fz - 6 * zoom);
	}
}

/**
 * Draws the origin gateway point on the canvas — the starting End Gateway
 * whose coordinates the user entered. Renders a cyan glow, a square marker,
 * and a coordinate label when zoom is high enough.
 *
 * @param ctx           - The 2D rendering context of the target canvas.
 * @param origin        - Origin gateway world coordinates.
 * @param worldToCanvas - Coordinate conversion function from
 *   {@link useMapInteraction}.
 * @param W             - Canvas width in pixels.
 * @param H             - Canvas height in pixels.
 * @param zoom          - Current zoom scale factor.
 */
export function drawOriginPoint(
	ctx: CanvasRenderingContext2D,
	origin: Coords,
	worldToCanvas: WorldToCanvas,
	W: number,
	H: number,
	zoom: number,
): void {
	const gridStep = BLOCK_SIZE * zoom;
	const { cx: gx, cy: gz } = worldToCanvas(origin.x, origin.z, W, H);

	const grad = ctx.createRadialGradient(gx, gz, 0, gx, gz, 20 * zoom);
	grad.addColorStop(0, "#7dd3fc");
	grad.addColorStop(0.5, "#38bdf844");
	grad.addColorStop(1, "transparent");
	ctx.beginPath();
	ctx.arc(gx, gz, 20 * zoom, 0, Math.PI * 2);
	ctx.fillStyle = grad;
	ctx.fill();

	const halfSize = Math.max(4, 6 * zoom);
	ctx.fillStyle = "#7dd3fc";
	ctx.shadowColor = "#7dd3fc";
	ctx.shadowBlur = 20;
	ctx.fillRect(gx - halfSize, gz - halfSize, halfSize * 2, halfSize * 2);
	ctx.shadowBlur = 0;

	if (gridStep > 3) {
		ctx.font = `${Math.max(10, 11 * zoom)}px "Share Tech Mono", monospace`;
		ctx.fillStyle = "#7dd3fc";
		ctx.fillText(`(${origin.x}, ${origin.z})`, gx + 8 * zoom, gz - 6 * zoom);
	}
}
