export type CanvasOptions = {
	mode: "fullscreen" | "minimized" | "maximized" | "hidden" | "shown",
	resizable: boolean,
	scale: number
}

export type RGBAColor = {
	red: number,
	green: number,
	blue: number,
	alpha: number
}

export type Position = {
	x: number,
	y: number
};