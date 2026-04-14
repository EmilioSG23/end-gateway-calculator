/**
 * Represents the display state of the hover tooltip on the End Map canvas.
 *
 * @remarks
 * When `visible` is `false` the tooltip should not be rendered.
 * `x` and `y` are pixel offsets relative to the canvas element.
 * `containerWidth` is used to decide whether to flip the tooltip
 * to the left so it stays inside the viewport.
 */
export interface TooltipState {
	/** Whether the tooltip is currently visible. */
	visible: boolean;
	/** Horizontal pixel position of the hovered point on the canvas. */
	x: number;
	/** Vertical pixel position of the hovered point on the canvas. */
	y: number;
	/** Width of the canvas container element in CSS pixels. Used for flip logic. */
	containerWidth: number;
	/** Title line shown at the top of the tooltip. */
	title: string;
	/** Label-value pairs displayed below the title. */
	rows: Array<{ label: string; value: string }>;
}

/**
 * Sentinel value representing a hidden tooltip with all fields reset to
 * their default/empty state. Use this as the initial `useState` value for
 * {@link TooltipState}.
 */
export const HIDDEN_TOOLTIP: TooltipState = {
	visible: false,
	x: 0,
	y: 0,
	containerWidth: 400,
	title: "",
	rows: [],
};
