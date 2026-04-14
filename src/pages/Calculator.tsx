import { BlockList } from "@/components/calculator/BlockList";
import { CoordInput } from "@/components/calculator/CoordInput";
import { DistanceSlider } from "@/components/calculator/DistanceSlider";
import { StatCard } from "@/components/calculator/StatCard";
import { EndMap } from "@/components/EndMap";
import { Header } from "@/components/Header";
import { SectionHeader } from "@/components/SectionHeader";
import DownloadSelect from "@/components/ui/DownloadSelect";
import { CHUNK_SIZE, MAX_DISTANCE, MIN_DISTANCE } from "@/consts";
import { useGatewayCalculator } from "@/hooks/useGatewayCalculator";
import { useModal } from "@/hooks/useModal";
import { GatewayIcon } from "@/icons/Gateway";
import { Commands } from "@/pages/Commands";
import { DOWNLOAD_FORMATS } from "@/services/download";

export function Calculator() {
	const {
		originX,
		originZ,
		distance,
		origin,
		hasNonZeroOrigin,
		angleRad,
		angleDeg,
		finalCoords,
		blocks,
		sliderPercent,
		setOriginX,
		setOriginZ,
		handleDistanceInput,
		handleSlider,
		downloadBlockList,
	} = useGatewayCalculator();

	const { openModal, setWidth } = useModal();

	function openCommands() {
		if (!finalCoords) return;
		setWidth(640);
		openModal(<Commands origin={origin} finalCoords={finalCoords} blocks={blocks} />);
	}

	return (
		<div className="relative min-h-screen flex flex-col bg-void text-text-primary">
			{/* Starfield */}
			<div className="starfield" aria-hidden="true" />

			{/* Header */}
			<Header />

			{/* Main layout */}
			<main className="relative z-10 flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full gap-0">
				{/* --- Left panel: controls + results --- */}
				<aside className="w-full lg:w-90 xl:w-100 shrink-0 border-r border-[#1a1a30] bg-deep/60 backdrop-blur-sm flex flex-col">
					<div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-6">
						{/* Section: Gateway input */}
						<section>
							<SectionHeader accentClass="bg-arc">Gateway Origin</SectionHeader>
							<div className="grid grid-cols-2 gap-3">
								<CoordInput label="X coordinate" value={originX} onChange={setOriginX} />
								<CoordInput label="Z coordinate" value={originZ} onChange={setOriginZ} />
							</div>
							{!hasNonZeroOrigin && (
								<p className="text-[10px] text-muted mt-2">
									Enter the coordinates of the End Gateway to calculate.
								</p>
							)}
						</section>

						{/* Section: Distance */}
						<section>
							<SectionHeader accentClass="bg-bolt">Target Distance</SectionHeader>
							<DistanceSlider
								value={distance}
								sliderPercent={sliderPercent}
								onChange={handleDistanceInput}
								onSlider={handleSlider}
							/>
						</section>

						{/* Section: Results */}
						{hasNonZeroOrigin && (
							<section>
								<SectionHeader accentClass="bg-bolt-glow">Calculated Results</SectionHeader>

								<div className="grid grid-cols-2 gap-2 mb-3">
									<StatCard label="Angle (radians)" value={angleRad.toFixed(6)} />
									<StatCard label="Angle (degrees)" value={`${angleDeg.toFixed(2)}°`} />
								</div>

								{finalCoords && (
									<div className="grid grid-cols-2 gap-2 mb-3">
										<StatCard
											label="Final X [Chunk X]"
											value={`${finalCoords.x} [${Math.floor(finalCoords.x / CHUNK_SIZE)}]`}
											accent
										/>
										<StatCard
											label="Final Z [Chunk Z]"
											value={`${finalCoords.z} [${Math.floor(finalCoords.z / CHUNK_SIZE)}]`}
											accent
										/>
									</div>
								)}

								<div className="rounded p-3 border border-border bg-surface">
									<p className="text-[10px] text-muted uppercase tracking-widest mb-1">
										Blocks to build
									</p>
									<p className="font-mono text-sm text-text-primary">
										{blocks.length > 0 ? (
											<>
												<span className="text-bolt-glow font-bold">{blocks.length}</span>{" "}
												<span className="text-muted">blocks</span>
											</>
										) : (
											<span className="text-muted">—</span>
										)}
									</p>
								</div>
							</section>
						)}

						{/* Section: Block list */}
						{blocks.length > 0 && (
							<section>
								<div className="flex items-center gap-2 mb-3">
									<SectionHeader accentClass="bg-purpur">
										Block List
										<div className="ml-4 inline-flex items-center">
											<DownloadSelect
												options={DOWNLOAD_FORMATS}
												onDonwload={downloadBlockList}
												placeholder="Download as..."
												title="Download block list"
											/>
										</div>
									</SectionHeader>
									<span className="ml-auto text-[10px] text-muted">scroll ↓</span>
								</div>
								<BlockList blocks={blocks} />
								<button
									onClick={openCommands}
									className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded border border-purpur-dim bg-purpur/10 text-[11px] font-mono text-bolt-glow uppercase tracking-widest hover:bg-purpur/20 hover:border-purpur transition-all cursor-pointer"
								>
									Show Creative Commands
								</button>
							</section>
						)}
					</div>

					{/* Footer info */}
					<div className="px-5 py-3 border-t border-[#1a1a30] text-[9px] text-muted flex justify-between">
						<span>
							MIN {MIN_DISTANCE} — MAX {MAX_DISTANCE} blocks
						</span>
						{blocks.length > 0 && <span>{blocks.length} coords computed</span>}
					</div>
				</aside>

				{/* --- Right panel: map --- */}
				<div className="flex-1 relative min-h-100 lg:min-h-0">
					{/* Map header */}
					<div className="absolute top-0 inset-x-0 z-10 border-b border-[#1a1a30] bg-void/80 backdrop-blur-sm px-4 py-2 flex items-center gap-3">
						<span className="text-[10px] text-muted uppercase tracking-widest">Spatial Map</span>
						<span className="text-[10px] text-muted">
							Pan: drag · Zoom: scroll / wheel · +/- buttons
						</span>
						{hasNonZeroOrigin && finalCoords && (
							<span className="ml-auto text-[10px] text-[#a855f7]">
								({origin.x}, {origin.z}) → ({finalCoords.x}, {finalCoords.z})
							</span>
						)}
					</div>

					<div className="absolute inset-0 pt-9">
						<EndMap origin={origin} final={finalCoords} blocks={blocks} />
					</div>

					{/* Empty state overlay */}
					{!hasNonZeroOrigin && (
						<div className="absolute inset-0 pt-9 flex items-center justify-center pointer-events-none">
							<div className="text-center">
								<GatewayIcon className="w-16 h-16 text-muted mx-auto mb-4 bg-purpur/25 rounded-full" />
								<p className="text-muted text-sm font-display tracking-widest">
									AWAITING COORDINATES
								</p>
								<p className="text-[10px] text-muted mt-2">
									Enter gateway origin to visualise the path
								</p>
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
