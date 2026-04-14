/** Props accepted by the {@link SectionHeader} component. */
interface SectionHeaderProps {
	/** Tailwind class for the left accent bar colour, e.g. `"bg-bolt"`. */
	accentClass: string;
	/** Section title text. */
	children: React.ReactNode;
}

/**
 * Section heading with a coloured left accent bar.
 *
 * @remarks
 * Used throughout the calculator panels to introduce labelled sections
 * with a consistent typographic style.
 *
 * @param props             - Component props; see {@link SectionHeaderProps}.
 * @param props.accentClass - Tailwind background-colour class for the accent bar.
 * @param props.children    - Title text.
 * @returns A flex container with an accent stripe and an uppercase heading.
 */
export function SectionHeader({ accentClass, children }: SectionHeaderProps) {
	return (
		<div className="flex items-center gap-2 mb-4">
			<span className={`w-1 h-4 rounded-full ${accentClass}`} />
			<h2 className="text-xs font-bold text-text-secondary uppercase tracking-widest">
				{children}
			</h2>
		</div>
	);
}
