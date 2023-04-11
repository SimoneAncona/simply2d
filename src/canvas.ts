import { Pointer } from "ref-napi";
import { delay, getWindow } from "./sdl2int.js";
import { SDL_WindowPos, SDL_Window_Flags } from "./sdl2bind.js";

type CanvasOptions = {
	mode: "fullscreen" | "minimazied" | "maximized" | "hidden" | "shown",
	resizable: boolean
}

export class Canvas {

	_width: number;
	_height: number;
	_window: Pointer<void>;

	constructor(
		title: string,
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
		this._window = getWindow(title, xPos, yPos, width, height, flags);
		delay(3000);
	}

	show() {
	}

	hide() {
	}
}