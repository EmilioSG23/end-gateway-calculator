import { GIT_HUB_URL } from "@/consts";
import { useModal } from "@/hooks/useModal";
import { GatewayIcon } from "@/icons/Gateway";
import { GitHubIcon } from "@/icons/GitHub";
import { HowToUse } from "@/pages/HowToUse";

/**
 * Internal action button used inside the application {@link Header}.
 *
 * @param props          - Component props.
 * @param props.onClick  - Click handler for the button.
 * @param props.children - Button label content.
 * @returns A styled `<button>` element (hidden on small screens).
 */
function Button({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
	return (
		<button
			onClick={onClick}
			className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-[12px] uppercase tracking-widest text-text-primary hover:text-bolt-bright hover:border-bolt/60 transition-colors duration-150 cursor-pointer"
		>
			{children}
		</button>
	);
}

/**
 * Application header bar.
 *
 * @remarks
 * Renders the app title and icon on the left, and conditionally shows a
 * GitHub link button (only when {@link GIT_HUB_URL} is non-empty) and a
 * "How to use" guide button on the right. The guide opens a {@link Modal}
 * populated with {@link HowToUse} via the global modal context.
 *
 * @returns A `<header>` element spanning the full page width.
 */
export function Header() {
	const { openModal, setWidth } = useModal();

	function handleGuide() {
		setWidth(600);
		openModal(<HowToUse />);
	}

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
				<div className="ml-auto flex items-center gap-3">
					{GIT_HUB_URL && (
						<Button onClick={() => window.open(GIT_HUB_URL, "_blank")}>
							<GitHubIcon className="w-3.5 h-3.5" />
							GitHub
						</Button>
					)}
					<Button onClick={handleGuide}>
						<span className="text-bolt font-display font-bold text-[11px]">?</span>
						How to use
					</Button>

					<div className="hidden sm:flex items-center gap-2 text-[10px] text-muted">
						<span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] animate-pulse inline-block" />
						PORTAL SYNC ACTIVE
					</div>
				</div>
			</div>
		</header>
	);
}
