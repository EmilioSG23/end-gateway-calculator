import { useMapInteraction } from "@/hooks/useMapInteraction";
import type { Coords } from "@/types/Coords";
import { HIDDEN_TOOLTIP, type TooltipState } from "@/types/MapTypes";

import { EndMapCanvas } from "@/components/end-map/EndMapCanvas";
import { EndMapControls } from "@/components/end-map/EndMapControls";
import { EndMapTooltip } from "@/components/end-map/EndMapTooltip";

import { hitDot } from "@/utils/mapHitDot";
import { useCallback, useState } from "react";

/** Props accepted by the {@link EndMap} component. */
interface EndMapProps {
	/** Gateway origin coordinates. */
	origin: Coords;
	/** Destination coordinates, or `null` when not yet calculated. */
	final: Coords | null;
	/** Ordered list of block coordinates forming the build path. */
	blocks: Coords[];
}

/**
 * Interactive End Map panel.
 *
 * @remarks
 * Orchestrates {@link EndMapCanvas}, {@link EndMapControls}, and
 * {@link EndMapTooltip} into a single interactive map experience. Owns the
 * tooltip state and wires together the pan/zoom interaction handlers from
 * {@link useMapInteraction} with the pointer-hit logic from {@link hitDot}.
 *
 * Mouse-move events update the tooltip by running `hitDot` against the
 * current canvas geometry. Mouse-leave events hide the tooltip and reset
 * any in-progress drag.
 *
 * @param props        - Component props; see {@link EndMapProps}.
 * @returns A positioned container with the canvas, controls overlay, and
 *   tooltip overlay.
 */
export function EndMap({ origin, final, blocks }: EndMapProps) {
	const [tooltip, setTooltip] = useState<TooltipState>(HIDDEN_TOOLTIP);

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

	/**
	 * Handles pointer movement on the canvas: delegates pan logic to the
	 * interaction hook and runs a hit-test to update the tooltip.
	 *
	 * @param e - The React mouse event from the canvas element.
	 */
	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLCanvasElement>) => {
			onMouseMove(e);
			const canvas = e.currentTarget;
			const rect = canvas.getBoundingClientRect();
			const result = hitDot(
				e.clientX - rect.left,
				e.clientY - rect.top,
				canvas.width,
				canvas.height,
				rect.width,
				origin,
				final,
				blocks,
				zoom,
				worldToCanvas,
			);
			if (result) {
				setTooltip(result);
			} else {
				setTooltip((t) => (t.visible ? { ...t, visible: false } : t));
			}
		},
		[onMouseMove, origin, final, blocks, worldToCanvas, zoom],
	);

	/**
	 * Hides the tooltip and ends any active drag when the pointer leaves the
	 * canvas bounds.
	 */
	const handleMouseLeave = useCallback(() => {
		onMouseUp();
		setTooltip((t) => ({ ...t, visible: false }));
	}, [onMouseUp]);

	return (
		<div className="relative w-full h-full">
			<EndMapCanvas
				origin={origin}
				final={final}
				blocks={blocks}
				zoom={zoom}
				pan={pan}
				worldToCanvas={worldToCanvas}
				onMouseDown={onMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={onMouseUp}
				onMouseLeave={handleMouseLeave}
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onTouchEnd}
				onWheel={onWheel}
			/>
			<EndMapTooltip tooltip={tooltip} />
			<EndMapControls
				zoom={zoom}
				hasFinal={final !== null}
				onZoomIn={zoomIn}
				onZoomOut={zoomOut}
				onReset={resetView}
				onGoToOrigin={goToOrigin}
				onGoToFinal={goToFinal}
			/>
		</div>
	);
}
