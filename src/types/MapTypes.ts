export interface TooltipState {
	visible: boolean;
	x: number;
	y: number;
	containerWidth: number;
	title: string;
	rows: Array<{ label: string; value: string }>;
}

export const HIDDEN_TOOLTIP: TooltipState = {
	visible: false,
	x: 0,
	y: 0,
	containerWidth: 400,
	title: "",
	rows: [],
};
