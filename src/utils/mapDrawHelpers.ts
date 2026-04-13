import { BLOCK_SIZE } from "@/hooks/useMapInteraction";
import type { Coords } from "@/types/Coords";

// End dimension zone constants ──────────────────────────────────────────────
/** Approximate radius of the central End island (blocks). */
export const END_ISLAND_RADIUS = 100;
/** Distance at which outer islands begin (blocks). */
export const END_OUTER_START = 1000;

/** Endstone base colors with different opacities for zones. */
const ENDSTONE_CENTER = "rgba(200,192,122,0.15)"; // central island (light)
const ENDSTONE_OUTER = "rgba(200,192,122,0.10)"; // outer islands (dense)
const ENDSTONE_BORDER = "rgba(120,100,50,0.85)"; // border stroke for zones

export type WorldToCanvas = (
	wx: number,
	wz: number,
	w: number,
	h: number,
) => { cx: number; cy: number };

// Zone helpers

export function getEndZone(x: number, z: number): string {
	const r = Math.hypot(x, z);
	if (r < END_ISLAND_RADIUS) return "Central Island";
	if (r < END_OUTER_START) return "Void";
	return "Outer Islands";
}

// Draw helpers

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

	// stroke the outer ring so it's clear where the void begins
	ctx.beginPath();
	ctx.arc(originX, originY, outerR, 0, Math.PI * 2);
	ctx.strokeStyle = ENDSTONE_BORDER;
	ctx.lineWidth = Math.max(1, 1.5 * zoom);
	ctx.stroke();

	// Central island: lighter, semi-transparent circle
	ctx.beginPath();
	ctx.arc(originX, originY, islandR, 0, Math.PI * 2);
	ctx.fillStyle = ENDSTONE_CENTER;
	ctx.fill();

	// stroke the central island edge
	ctx.beginPath();
	ctx.arc(originX, originY, islandR, 0, Math.PI * 2);
	ctx.strokeStyle = ENDSTONE_BORDER;
	ctx.lineWidth = Math.max(1, 1.5 * zoom);
	ctx.stroke();

	ctx.restore();
}

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

export function drawGrid(
	ctx: CanvasRenderingContext2D,
	W: number,
	H: number,
	zoom: number,
	pan: { x: number; y: number },
): { originX: number; originY: number } {
	const gridStep = BLOCK_SIZE * zoom;
	const gridAlpha = Math.min(0.3, Math.max(0.05, gridStep / 60));
	const originX = W / 2 + pan.x * zoom;
	const originY = H / 2 + pan.y * zoom;

	ctx.strokeStyle = `rgba(42,42,74,${gridAlpha})`;
	ctx.lineWidth = 0.5;

	const startCol = Math.floor(-originX / gridStep);
	const endCol = Math.ceil((W - originX) / gridStep);
	for (let col = startCol; col <= endCol; col++) {
		const x = originX + col * gridStep;
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, H);
		ctx.stroke();
	}

	const startRow = Math.floor(-originY / gridStep);
	const endRow = Math.ceil((H - originY) / gridStep);
	for (let row = startRow; row <= endRow; row++) {
		const y = originY + row * gridStep;
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(W, y);
		ctx.stroke();
	}

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

/** Dashed rings at the 768/1024 build-line boundaries. */
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
			const r = Math.max(1.5, 2.5 * zoom);
			ctx.beginPath();
			ctx.arc(cx, cy, r, 0, Math.PI * 2);
			ctx.fillStyle = "#c084fc";
			ctx.fill();
		}
	}
}

/**
 * Draws the destination point and the direction ray from world (0,0).
 * @param originX Canvas X of world coordinate (0, 0).
 * @param originY Canvas Y of world coordinate (0, 0).
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

	ctx.beginPath();
	ctx.arc(fx, fz, Math.max(3, 5 * zoom), 0, Math.PI * 2);
	ctx.fillStyle = "#e0aaff";
	ctx.shadowColor = "#c084fc";
	ctx.shadowBlur = 16;
	ctx.fill();
	ctx.shadowBlur = 0;

	if (gridStep > 3) {
		ctx.font = `${Math.max(10, 11 * zoom)}px "Share Tech Mono", monospace`;
		ctx.fillStyle = "#e0aaff";
		ctx.fillText(`(${final.x}, ${final.z})`, fx + 8 * zoom, fz - 6 * zoom);
	}
}

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

	ctx.beginPath();
	ctx.arc(gx, gz, Math.max(4, 6 * zoom), 0, Math.PI * 2);
	ctx.fillStyle = "#7dd3fc";
	ctx.shadowColor = "#7dd3fc";
	ctx.shadowBlur = 20;
	ctx.fill();
	ctx.shadowBlur = 0;

	if (gridStep > 3) {
		ctx.font = `${Math.max(10, 11 * zoom)}px "Share Tech Mono", monospace`;
		ctx.fillStyle = "#7dd3fc";
		ctx.fillText(`(${origin.x}, ${origin.z})`, gx + 8 * zoom, gz - 6 * zoom);
	}
}
