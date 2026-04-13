interface SectionHeaderProps {
	accentClass: string;
	children: React.ReactNode;
}

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
