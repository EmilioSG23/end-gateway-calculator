import type { Coords } from "@/types/Coords";
import type { WorldToCanvas } from "@/utils/mapDrawHelpers";
import {
	drawBuildLine,
	drawCompass,
	drawEndZones,
	drawFinalPoint,
	drawGatewayRings,
	drawGrid,
	drawOriginPoint,
} from "@/utils/mapDrawHelpers";
import { useCallback, useEffect, useRef } from "react";

/** Props accepted by the {@link EndMapCanvas} component. */
interface EndMapCanvasProps {
	/** Gateway origin coordinates. */
	origin: Coords;
	/** Destination coordinates, or `null` when not yet calculated. */
	final: Coords | null;
	/** Ordered list of block coordinates forming the build path. */
	blocks: Coords[];
	/** Current zoom scale factor. */
	zoom: number;
	/** Current pan offset in world blocks. */
	pan: { x: number; y: number };
	/** Converts world block coordinates to canvas pixel coordinates. */
	worldToCanvas: WorldToCanvas;
	/** Mouse-down handler — starts a pan drag. */
	onMouseDown: (e: React.MouseEvent) => void;
	/** Mouse-move handler — pans while dragging or triggers hit-testing upstream. */
	onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
	/** Mouse-up handler — ends a pan drag. */
	onMouseUp: () => void;
	/** Mouse-leave handler — hides tooltip and ends drag. */
	onMouseLeave: () => void;
	/** Touch-start handler for single-finger pan. */
	onTouchStart: (e: React.TouchEvent) => void;
	/** Touch-move handler for single-finger pan. */
	onTouchMove: (e: React.TouchEvent) => void;
	/** Touch-end handler — clears the stored touch position. */
	onTouchEnd: () => void;
	/** Wheel handler — zooms the canvas. */
	onWheel: (e: React.WheelEvent) => void;
}

/**
 * Canvas-based End Map renderer with pan/zoom support.
 *
 * @remarks
 * Uses a `ResizeObserver` to keep the canvas pixel dimensions in sync with
 * its container, triggering a redraw whenever the container resizes.
 * All drawing is performed by the helpers in `@/utils/mapDrawHelpers`.
 *
 * @param props - Component props; see {@link EndMapCanvasProps}.
 * @returns A `<div>` container holding a `<canvas>` element.
 */
export function EndMapCanvas({
	origin,
	final,
	blocks,
	zoom,
	pan,
	worldToCanvas,
	onMouseDown,
	onMouseMove,
	onMouseUp,
	onMouseLeave,
	onTouchStart,
	onTouchMove,
	onTouchEnd,
	onWheel,
}: EndMapCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const prevBodyOverflow = useRef<string | null>(null);

	const disableBodyScroll = () => {
		if (prevBodyOverflow.current === null) prevBodyOverflow.current = document.body.style.overflow;
		document.body.style.overflow = "hidden";
	};

	const restoreBodyScroll = () => {
		if (prevBodyOverflow.current === null) return;
		document.body.style.overflow = prevBodyOverflow.current;
		prevBodyOverflow.current = null;
	};

	/**
	 * Redraws the entire canvas using the current props.
	 * Memoised so it only re-runs when any of the relevant values change.
	 */
	const draw = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const W = canvas.width;
		const H = canvas.height;

		ctx.fillStyle = "#080810";
		ctx.fillRect(0, 0, W, H);

		const { originX, originY } = drawGrid(ctx, W, H, zoom, pan);
		drawEndZones(ctx, W, H, originX, originY, zoom);
		drawGatewayRings(ctx, originX, originY, zoom);
		drawBuildLine(ctx, blocks, worldToCanvas, W, H, zoom);
		if (final) drawFinalPoint(ctx, final, worldToCanvas, W, H, zoom, originX, originY);
		drawOriginPoint(ctx, origin, worldToCanvas, W, H, zoom);
		drawCompass(ctx, W);
	}, [origin, final, blocks, zoom, pan, worldToCanvas]);

	// Sync canvas pixel dimensions with container and redraw on resize
	useEffect(() => {
		const container = containerRef.current;
		const canvas = canvasRef.current;
		if (!container || !canvas) return;
		const ro = new ResizeObserver(() => {
			canvas.width = container.clientWidth;
			canvas.height = container.clientHeight;
			draw();
		});
		ro.observe(container);
		canvas.width = container.clientWidth;
		canvas.height = container.clientHeight;
		draw();
		return () => ro.disconnect();
	}, [draw]);

	useEffect(() => {
		draw();
	}, [draw]);

	return (
		<div className="absolute inset-0" ref={containerRef}>
			<canvas
				ref={canvasRef}
				className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
				onMouseDown={(e) => {
					disableBodyScroll();
					onMouseDown(e);
				}}
				onMouseMove={onMouseMove}
				onMouseUp={() => {
					onMouseUp();
				}}
				onMouseLeave={() => {
					onMouseLeave();
				}}
				onPointerLeave={() => {
					restoreBodyScroll();
				}}
				onPointerEnter={disableBodyScroll}
				onTouchStart={(e) => {
					disableBodyScroll();
					onTouchStart(e);
				}}
				onTouchMove={onTouchMove}
				onTouchEnd={() => {
					onTouchEnd();
					restoreBodyScroll();
				}}
				onWheelCapture={(e) => {
					disableBodyScroll();
					onWheel(e as unknown as React.WheelEvent);
				}}
			/>
		</div>
	);
}
