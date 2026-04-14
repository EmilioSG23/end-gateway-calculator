/** Props accepted by the {@link CopyIcon} component. */
interface CopyIconProps {
	/** Optional CSS class applied to the `<svg>` element. */
	className?: string;
	/** Additional props are spread onto the `<svg>` element, allowing for
	 * standard SVG attributes like `width`, `height`, `aria-label`, etc. */
	props?: React.SVGProps<SVGSVGElement>;
}

/**
 * Copy-to-clipboard SVG icon.
 *
 * @remarks
 * Renders an outlined clipboard icon. Strokes use `currentColor`.
 * The element is marked `aria-hidden="true"` and should be accompanied
 * by an accessible label on the containing button.
 *
 * @param props           - Component props.
 * @param props.className - Optional CSS class applied to the `<svg>` element.
 * @param props.props     - Additional props spread onto the `<svg>` element.
 * @returns An `<svg>` element rendering a copy icon.
 */
export function CopyIcon({ className, ...props }: CopyIconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			{...props}
			aria-hidden="true"
		>
			<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
			<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
		</svg>
	);
}
