import type { Coords } from "@/types/Coords";
import { useCallback, useRef, useState } from "react";

export const BLOCK_SIZE = 6;
const MIN_ZOOM = 0.05;
const MAX_ZOOM = 8;

export interface MapInteractionHandlers {
	zoom: number;
	pan: { x: number; y: number };
	worldToCanvas: (wx: number, wz: number, w: number, h: number) => { cx: number; cy: number };
	onMouseDown: (e: React.MouseEvent) => void;
	onMouseMove: (e: React.MouseEvent) => void;
	onMouseUp: () => void;
	onTouchStart: (e: React.TouchEvent) => void;
	onTouchMove: (e: React.TouchEvent) => void;
	onTouchEnd: () => void;
	onWheel: (e: React.WheelEvent) => void;
	zoomIn: () => void;
	zoomOut: () => void;
	goToOrigin: () => void;
	goToFinal: () => void;
	resetView: () => void;
}

export function useMapInteraction(origin: Coords, final: Coords | null): MapInteractionHandlers {
	const [zoom, setZoom] = useState(1);
	const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
	const isDragging = useRef(false);
	const lastMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const lastTouch = useRef<{ x: number; y: number } | null>(null);

	const worldToCanvas = useCallback(
		(wx: number, wz: number, w: number, h: number) => {
			const cx = w / 2 + (wx * BLOCK_SIZE + pan.x) * zoom;
			const cy = h / 2 + (wz * BLOCK_SIZE + pan.y) * zoom;
			return { cx, cy };
		},
		[zoom, pan],
	);

	const onMouseDown = (e: React.MouseEvent) => {
		isDragging.current = true;
		lastMouse.current = { x: e.clientX, y: e.clientY };
	};

	const onMouseMove = (e: React.MouseEvent) => {
		if (!isDragging.current) return;
		const dx = (e.clientX - lastMouse.current.x) / zoom;
		const dy = (e.clientY - lastMouse.current.y) / zoom;
		lastMouse.current = { x: e.clientX, y: e.clientY };
		setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
	};

	const onMouseUp = () => {
		isDragging.current = false;
	};

	const onTouchStart = (e: React.TouchEvent) => {
		if (e.touches.length === 1)
			lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
	};

	const onTouchMove = (e: React.TouchEvent) => {
		if (e.touches.length !== 1 || !lastTouch.current) return;
		const dx = (e.touches[0].clientX - lastTouch.current.x) / zoom;
		const dy = (e.touches[0].clientY - lastTouch.current.y) / zoom;
		lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
		setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
	};

	const onTouchEnd = () => {
		lastTouch.current = null;
	};

	const onWheel = (e: React.WheelEvent) => {
		e.preventDefault();
		const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
		setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * factor)));
	};

	const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, z * 1.25));
	const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, z / 1.25));

	const goToOrigin = () => setPan({ x: -origin.x * BLOCK_SIZE, y: -origin.z * BLOCK_SIZE });

	const goToFinal = () => {
		if (!final) return;
		setPan({ x: -final.x * BLOCK_SIZE, y: -final.z * BLOCK_SIZE });
	};

	const resetView = () => {
		setPan({ x: 0, y: 0 });
		setZoom(1);
	};

	return {
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
	};
}
