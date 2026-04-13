import { BLOCK_SIZE, useMapInteraction } from "@/hooks/useMapInteraction";
import {
	drawBuildLine,
	drawCompass,
	drawEndZones,
	drawFinalPoint,
	drawGatewayRings,
	drawGrid,
	drawOriginPoint,
	getEndZone,
} from "@/utils/mapDrawHelpers";
import type { Coords } from "@/types/Coords";
import { useCallback, useEffect, useRef, useState } from "react";

interface EndMapProps {
	origin: Coords;
	final: Coords | null;
	blocks: Coords[];
}

interface TooltipState {
	visible: boolean;
	x: number;
	y: number;
	containerWidth: number;
	title: string;
	rows: Array<{ label: string; value: string }>;
}

const HIT_RADIUS = 14;

export function EndMap({ origin, final, blocks }: EndMapProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [tooltip, setTooltip] = useState<TooltipState>({
		visible: false,
		x: 0,
		y: 0,
		containerWidth: 400,
		title: "",
		rows: [],
	});

	const {
		zoom,
		pan,
		worldToCanvas,
		onMouseDown,
		onMouseMove,
		onMouseUp,
		onTouchStart,
		onTouchMove,
		onTouchEnd,
		onWheel,
		zoomIn,
		zoomOut,
		goToOrigin,
		goToFinal,
		resetView,
	} = useMapInteraction(origin, final);

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

	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLCanvasElement>) => {
			onMouseMove(e);

			const canvas = canvasRef.current;
			if (!canvas) return;

			const rect = canvas.getBoundingClientRect();
			const mx = e.clientX - rect.left;
			const my = e.clientY - rect.top;
			const W = canvas.width;
			const H = canvas.height;
			const containerWidth = rect.width;

			// Hit-test: origin gateway
			const { cx: ox, cy: oz } = worldToCanvas(origin.x, origin.z, W, H);
			if (Math.hypot(mx - ox, my - oz) < HIT_RADIUS) {
				const dist = Math.round(Math.hypot(origin.x, origin.z));
				setTooltip({
					visible: true,
					x: mx,
					y: my,
					containerWidth,
					title: "Origin Gateway",
					rows: [
						{ label: "Coords", value: `${origin.x}, ${origin.z}` },
						{ label: "Distance", value: `${dist} blocks` },
						{ label: "Zone", value: getEndZone(origin.x, origin.z) },
					],
				});
				return;
			}

			// Hit-test: destination
			if (final) {
				const { cx: fx, cy: fz } = worldToCanvas(final.x, final.z, W, H);
				if (Math.hypot(mx - fx, my - fz) < HIT_RADIUS) {
					const dist = Math.round(Math.hypot(final.x, final.z));
					setTooltip({
						visible: true,
						x: mx,
						y: my,
						containerWidth,
						title: "Destination",
						rows: [
							{ label: "Coords", value: `${final.x}, ${final.z}` },
							{ label: "Distance", value: `${dist} blocks` },
							{ label: "Zone", value: getEndZone(final.x, final.z) },
						],
					});
					return;
				}
			}

			// Hit-test: individual build-line blocks (only when dots are rendered)
			if (blocks.length > 1 && BLOCK_SIZE * zoom > 4) {
				for (let i = 0; i < blocks.length; i++) {
					const { cx, cy } = worldToCanvas(blocks[i].x, blocks[i].z, W, H);
					if (Math.hypot(mx - cx, my - cy) < HIT_RADIUS) {
						const dist = Math.round(Math.hypot(blocks[i].x, blocks[i].z));
						setTooltip({
							visible: true,
							x: mx,
							y: my,
							containerWidth,
							title: `Build Block #${i + 1}`,
							rows: [
								{ label: "Coords", value: `${blocks[i].x}, ${blocks[i].z}` },
								{ label: "Distance", value: `${dist} blocks` },
								{ label: "Zone", value: getEndZone(blocks[i].x, blocks[i].z) },
							],
						});
						return;
					}
				}
			}

			setTooltip((t) => (t.visible ? { ...t, visible: false } : t));
		},
		[onMouseMove, origin, final, blocks, worldToCanvas, zoom],
	);

	const handleMouseLeave = useCallback(() => {
		onMouseUp();
		setTooltip((t) => ({ ...t, visible: false }));
	}, [onMouseUp]);

	// Sync canvas size and redraw on resize
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
		<div className="relative w-full h-full" ref={containerRef}>
			<canvas
				ref={canvasRef}
				className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
				onMouseDown={onMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={onMouseUp}
				onMouseLeave={handleMouseLeave}
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onTouchEnd}
				onWheelCapture={onWheel}
			/>

			{/* Tooltip */}
			{tooltip.visible && (
				<div
					className="absolute z-20 pointer-events-none"
					style={{
						left: tooltip.x > tooltip.containerWidth * 0.6 ? tooltip.x - 180 : tooltip.x + 16,
						top: Math.max(8, tooltip.y - 8),
					}}
				>
					<div className="bg-deep/95 border border-border rounded px-3 py-2 text-[11px] min-w-[168px] backdrop-blur-sm shadow-lg shadow-black/40">
						<div className="text-text-primary font-medium mb-1.5 font-mono">{tooltip.title}</div>
						{tooltip.rows.map((r) => (
							<div key={r.label} className="flex justify-between gap-4 leading-5">
								<span className="text-text-muted">{r.label}</span>
								<span className="text-text-secondary font-mono">{r.value}</span>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Zoom controls */}
			<div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
				<button
					onClick={zoomIn}
					title="Zoom in"
					className="w-9 h-9 rounded border border-border bg-deep/90 text-bolt-glow text-lg font-bold hover:bg-elevated hover:border-bolt transition-colors flex items-center justify-center"
				>
					+
				</button>
				<button
					onClick={zoomOut}
					title="Zoom out"
					className="w-9 h-9 rounded border border-border bg-deep/90 text-bolt-glow text-lg font-bold hover:bg-elevated hover:border-bolt transition-colors flex items-center justify-center"
				>
					−
				</button>
				<button
					onClick={resetView}
					title="Reset view"
					className="w-9 h-9 rounded border border-border bg-deep/90 text-text-secondary text-xs hover:bg-elevated hover:border-bolt hover:text-bolt-glow transition-colors flex items-center justify-center"
				>
					⊡
				</button>
			</div>

			{/* Navigation buttons */}
			<div className="absolute bottom-4 left-4 flex flex-col gap-2 z-10">
				<button
					onClick={goToOrigin}
					title="Go to origin gateway"
					className="px-3 py-1.5 rounded border border-border bg-deep/90 text-arc text-xs hover:bg-elevated hover:border-arc-dim transition-colors"
				>
					⊕ Origin
				</button>
				{final && (
					<button
						onClick={goToFinal}
						title="Go to final coordinates"
						className="px-3 py-1.5 rounded border border-border bg-deep/90 text-bolt-glow text-xs hover:bg-elevated hover:border-bolt transition-colors"
					>
						⊗ Destination
					</button>
				)}
			</div>

			{/* Legend */}
			<div className="absolute top-4 left-4 flex flex-col gap-1 z-10 text-[10px] text-text-muted">
				<div className="flex items-center gap-2">
					<span className="w-3 h-0.5 bg-arc inline-block" />
					<span>Origin</span>
				</div>
				<div className="flex items-center gap-2">
					<span className="w-3 h-0.5 bg-bolt-bright inline-block" />
					<span>Destination</span>
				</div>
				<div className="flex items-center gap-2">
					<span className="w-3 h-0.5 bg-bolt inline-block" />
					<span>Build line</span>
				</div>
				<div className="flex items-center gap-2 mt-1 opacity-60">
					<span className="w-3 h-0.5 border-t border-dashed border-bolt inline-block" />
					<span>Min/Max radius</span>
				</div>
				<div className="flex items-center gap-2 mt-1 opacity-50">
					<span
						className="w-3 h-1.5 rounded-sm inline-block"
						style={{ background: "rgba(200,192,122,0.45)" }}
					/>
					<span>End stone</span>
				</div>
			</div>

			{/* Zoom indicator */}
			<div className="absolute top-4 right-4 text-[10px] text-muted z-10">×{zoom.toFixed(2)}</div>
		</div>
	);
}
