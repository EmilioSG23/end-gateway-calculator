interface DownloadSelectProps<T extends string> {
	placeholder?: string;
	options: readonly T[];
	onDonwload: (option: T) => void;
	title?: string;
	className?: string;
}

export function DownloadSelect<T extends string>({
	placeholder = "Select",
	options,
	onDonwload,
	title,
	className,
}: DownloadSelectProps<T>) {
	return (
		<select
			defaultValue=""
			onChange={(e) => {
				if (e.target.value) {
					onDonwload(e.target.value as T);
					e.target.value = "";
				}
			}}
			className={`bg-surface border border-border rounded px-2 py-1 text-[11px] text-muted cursor-pointer hover:border-purpur focus:outline-none focus:border-purpur transition-colors appearance-none ${className}`}
			title={title}
		>
			<option value="" disabled>
				{placeholder}
			</option>
			{options.map((fmt) => (
				<option key={fmt} value={fmt}>
					{fmt.toUpperCase()}
				</option>
			))}
		</select>
	);
}

export default DownloadSelect;
