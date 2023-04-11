import { Pointer } from "ref-napi";
import { clearWithColor, delay, getRenderer, getWindow, hideWindow, setLine, setPoint, showWindow } from "./sdl2int.js";
import { SDL_WindowPos, SDL_Window_Flags } from "./sdl2bind.js";
import { CanvasOptions, Position, RGBAColor } from "./types.js";

export class Canvas {

	_width: number;
	_height: number;
	_window: Pointer<void>;
	_renderer: Pointer<void>;

	constructor(
		windowTitle: string,
		width: number,
		height: number,
		xPos: number = SDL_WindowPos.SDL_WINDOWPOS_CENTERED,
		yPos: number = SDL_WindowPos.SDL_WINDOWPOS_CENTERED,
		options: CanvasOptions = {
			mode: "shown",
			resizable: false
		}
	) {
		let flags: number;
		this._width = width;
		this._height = height;
		if (options.mode === "fullscreen") flags |= SDL_Window_Flags.SDL_WINDOW_FULLSCREEN;
		else if (options.mode === "hidden") flags |= SDL_Window_Flags.SDL_WINDOW_HIDDEN;
		else if (options.mode === "maximized") flags |= SDL_Window_Flags.SDL_WINDOW_MAXIMIZED;
		else if (options.mode === "minimazied") flags |= SDL_Window_Flags.SDL_WINDOW_MINIMIZED;
		else if (options.mode === "shown") flags |= SDL_Window_Flags.SDL_WINDOW_SHOWN;
		this._window = getWindow(windowTitle, xPos, yPos, width, height, flags);
		this._renderer = getRenderer(this._window, -1, 0);
	}

	show() {
		showWindow(this._window);
	}

	hide() {
		hideWindow(this._window);
	}

	setBackgroundColor(color: RGBAColor) {
		clearWithColor(this._renderer, color.red, color.green, color.blue, color.alpha);
	}

	sleep(ms: number) {
		delay(ms);
	}

	drawPoint(color: RGBAColor, position: Position) {
		setPoint(this._renderer, color.red, color.green, color.blue, color.alpha, position.x, position.y);
	}

	drawLine(color: RGBAColor, from: Position, to: Position) {
		setLine(this._renderer, color.red, color.green, color.blue, color.alpha, from.x, from.y, to.x, to.y);
	}

	loadRawData(pixels: Uint8Array) {
		if (pixels.length != this._height * this._width) throw "The buffer must be the same size as the window resolution";
	}

	getWidth() { return this._width };
	getHeight() { return this._height };

	clear() {
		clearWithColor(this._renderer, 0, 0, 0, 255);
	}
}