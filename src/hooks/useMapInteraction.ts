import type { Coords } from "@/types/Coords";
import { useCallback, useRef, useState } from "react";

/**
 * Base size of one Minecraft block in canvas pixels at zoom level `1`.
 * All zoom-dependent pixel calculations multiply by `BLOCK_SIZE * zoom`.
 */
export const BLOCK_SIZE = 6;

/** Minimum allowed zoom level (most zoomed-out). */
const MIN_ZOOM = 0.05;

/** Maximum allowed zoom level (most zoomed-in). */
const MAX_ZOOM = 8;

/**
 * Describes all interaction state and event handlers returned by
 * {@link useMapInteraction}.
 */
export interface MapInteractionHandlers {
	/** Current zoom scale factor. `1` is the default, `2` means 2× zoom-in. */
	zoom: number;
	/** Current pan offset in world blocks. Applied before zoom scaling. */
	pan: { x: number; y: number };
	/**
	 * Converts world block coordinates to canvas pixel coordinates using
	 * the current `zoom` and `pan` values.
	 *
	 * @param wx - World X in blocks.
	 * @param wz - World Z in blocks.
	 * @param w  - Canvas width in pixels.
	 * @param h  - Canvas height in pixels.
	 * @returns Pixel position `{ cx, cy }` on the canvas.
	 */
	worldToCanvas: (wx: number, wz: number, w: number, h: number) => { cx: number; cy: number };
	/** Mouse-down handler — starts a drag operation. */
	onMouseDown: (e: React.MouseEvent) => void;
	/** Mouse-move handler — pans the map if dragging, otherwise no-op. */
	onMouseMove: (e: React.MouseEvent) => void;
	/** Mouse-up handler — ends the current drag operation. */
	onMouseUp: () => void;
	/** Touch-start handler — records start position for single-finger pan. */
	onTouchStart: (e: React.TouchEvent) => void;
	/** Touch-move handler — pans the map following a single finger. */
	onTouchMove: (e: React.TouchEvent) => void;
	/** Touch-end handler — clears the stored touch position. */
	onTouchEnd: () => void;
	/** Wheel handler — zooms in/out centred on the current viewport. */
	onWheel: (e: React.WheelEvent) => void;
	/** Increases zoom by a fixed step (×1.25), clamped at {@link MAX_ZOOM}. */
	zoomIn: () => void;
	/** Decreases zoom by a fixed step (÷1.25), clamped at {@link MIN_ZOOM}. */
	zoomOut: () => void;
	/** Pans the view so the origin gateway is centred on screen. */
	goToOrigin: () => void;
	/** Pans the view so the destination point is centred on screen. No-op when
	 * `final` is `null`. */
	goToFinal: () => void;
	/** Resets pan to `{ x: 0, y: 0 }` and zoom to `1`. */
	resetView: () => void;
}

/**
 * Manages the interactive pan-and-zoom state for the End Map canvas.
 *
 * @remarks
 * Exposes mouse, touch, and wheel event handlers suitable for attaching
 * directly to a `<canvas>` element as well as programmatic navigation
 * helpers (zoom in/out, go to origin, go to final, reset view).
 *
 * The `worldToCanvas` function is memoised with `useCallback` and only
 * changes when `zoom` or `pan` change, making it safe to use as a
 * dependency in downstream `useEffect` / `useCallback` hooks.
 *
 * @param origin - The gateway origin coordinates (used by `goToOrigin`).
 * @param final  - The destination coordinates, or `null` when not yet
 *   calculated (used by `goToFinal`).
 * @returns A {@link MapInteractionHandlers} object.
 */
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
