interface EndMapControlsProps {
	zoom: number;
	hasFinal: boolean;
	onZoomIn: () => void;
	onZoomOut: () => void;
	onReset: () => void;
	onGoToOrigin: () => void;
	onGoToFinal: () => void;
}

export function EndMapControls({
	zoom,
	hasFinal,
	onZoomIn,
	onZoomOut,
	onReset,
	onGoToOrigin,
	onGoToFinal,
}: EndMapControlsProps) {
	return (
		<>
			{/* Zoom controls */}
			<div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
				<button
					onClick={onZoomIn}
					title="Zoom in"
					className="cursor-pointer size-9 rounded border border-border bg-deep/90 text-bolt-glow text-lg font-bold hover:bg-elevated hover:border-bolt transition-colors flex items-center justify-center"
				>
					+
				</button>
				<button
					onClick={onZoomOut}
					title="Zoom out"
					className="cursor-pointer size-9 rounded border border-border bg-deep/90 text-bolt-glow text-lg font-bold hover:bg-elevated hover:border-bolt transition-colors flex items-center justify-center"
				>
					−
				</button>
				<button
					onClick={onReset}
					title="Reset view"
					className="cursor-pointer size-9 rounded border border-border bg-deep/90 text-text-secondary text-xs hover:bg-elevated hover:border-bolt hover:text-bolt-glow transition-colors flex items-center justify-center"
				>
					⊡
				</button>
			</div>

			{/* Navigation buttons */}
			<div className="absolute bottom-4 left-4 flex flex-col gap-2 z-10">
				<button
					onClick={onGoToOrigin}
					title="Go to origin gateway"
					className="cursor-pointer px-3 py-1.5 rounded border border-border bg-deep/90 text-arc text-xs hover:bg-elevated hover:border-arc-dim transition-colors"
				>
					⊕ Origin
				</button>
				{hasFinal && (
					<button
						onClick={onGoToFinal}
						title="Go to final coordinates"
						className="cursor-pointer px-3 py-1.5 rounded border border-border bg-deep/90 text-bolt-glow text-xs hover:bg-elevated hover:border-bolt transition-colors"
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
		</>
	);
}
