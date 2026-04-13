import { useMapInteraction } from "@/hooks/useMapInteraction";
import type { Coords } from "@/types/Coords";
import { HIDDEN_TOOLTIP, type TooltipState } from "@/types/MapTypes";

import { EndMapCanvas } from "@/components/end-map/EndMapCanvas";
import { EndMapControls } from "@/components/end-map/EndMapControls";
import { EndMapTooltip } from "@/components/end-map/EndMapTooltip";

import { hitDot } from "@/utils/mapHitDot";
import { useCallback, useState } from "react";

interface EndMapProps {
	origin: Coords;
	final: Coords | null;
	blocks: Coords[];
}

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
