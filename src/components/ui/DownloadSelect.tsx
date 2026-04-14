/**
 * Props accepted by the {@link DownloadSelect} generic component.
 *
 * @typeParam T - String literal union that constrains valid option values.
 */
interface DownloadSelectProps<T extends string> {
	/** Placeholder text shown when no option is selected. Defaults to `"Select"`. */
	placeholder?: string;
	/** Tuple or array of available option strings. Each option is rendered
	 * upper-cased in the dropdown. */
	options: readonly T[];
	/**
	 * Callback invoked with the selected option value.
	 *
	 * @remarks Intentional typo preserved from the original API (`onDonwload`).
	 * @param option - The chosen option value.
	 */
	onDonwload: (option: T) => void;
	/** Optional `title` tooltip attribute for the `<select>` element. */
	title?: string;
	/** Optional extra CSS classes applied to the `<select>` element. */
	className?: string;
}

/**
 * Generic format-selection dropdown that resets after each selection.
 *
 * @remarks
 * Uses an uncontrolled `<select>` with `defaultValue=""` so it returns to
 * the placeholder after each pick, making it suitable for one-shot actions
 * like file downloads.
 *
 * @typeParam T - String literal union constraining the option values.
 *
 * @param props             - Component props; see {@link DownloadSelectProps}.
 * @returns A styled `<select>` element populated with the provided options.
 */
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
