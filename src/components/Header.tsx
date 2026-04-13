import { GatewayIcon } from "@/icons/Gateway";

export function Header() {
	return (
		<header className="relative z-10 border-b border-[#1a1a30] bg-deep/80 backdrop-blur-sm">
			<div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
				<GatewayIcon className="text-[#a855f7] bg-bolt/75 gateway-glow rounded-full" />
				<div>
					<h1
						className="font-display text-xl font-bold tracking-widest text-bolt-bright"
						style={{ textShadow: "0 0 20px rgba(192,132,252,0.5)" }}
					>
						END GATEWAY CALCULATOR
					</h1>
					<p className="text-[10px] text-text-muted tracking-widest uppercase mt-0.5">
						The End — Void Navigation System
					</p>
				</div>
				<div className="ml-auto hidden sm:flex items-center gap-2 text-[10px] text-muted">
					<span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] animate-pulse inline-block" />
					PORTAL SYNC ACTIVE
				</div>
			</div>
		</header>
	);
}
