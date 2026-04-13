import {
	drawBuildLine,
	drawCompass,
	drawEndZones,
	drawFinalPoint,
	drawGatewayRings,
	drawGrid,
	drawOriginPoint,
} from "@/utils/mapDrawHelpers";
import type { WorldToCanvas } from "@/utils/mapDrawHelpers";
import type { Coords } from "@/types/Coords";
import { useCallback, useEffect, useRef } from "react";

interface EndMapCanvasProps {
	origin: Coords;
	final: Coords | null;
	blocks: Coords[];
	zoom: number;
	pan: { x: number; y: number };
	worldToCanvas: WorldToCanvas;
	onMouseDown: (e: React.MouseEvent) => void;
	onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
	onMouseUp: () => void;
	onMouseLeave: () => void;
	onTouchStart: (e: React.TouchEvent) => void;
	onTouchMove: (e: React.TouchEvent) => void;
	onTouchEnd: () => void;
	onWheel: (e: React.WheelEvent) => void;
}

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
				onMouseDown={onMouseDown}
				onMouseMove={onMouseMove}
				onMouseUp={onMouseUp}
				onMouseLeave={onMouseLeave}
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onTouchEnd}
				onWheelCapture={onWheel}
			/>
		</div>
	);
}
