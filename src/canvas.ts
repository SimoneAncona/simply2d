import { Pointer } from "ref-napi";
import { clearWithColor, delay, getRenderer, getWindow, hideWindow, setJPG, setLine, setPNG, setPoint, showWindow } from "./sdl2int.js";
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

	/**
	 * Show the window
	 * @since v0.1.0
	 */
	show() {
		showWindow(this._window);
	}

	/**
	 * Hide the window
	 * @since v0.1.0
	 */
	hide() {
		hideWindow(this._window);
	}

	/**
	 * Change the background color
	 * @param {RGBAColor} color the color of the background
	 * @since v0.1.0
	 */
	setBackgroundColor(color: RGBAColor) {
		clearWithColor(this._renderer, color.red, color.green, color.blue, color.alpha);
	}

	/**
	 * Sleep `ms` milliseconds
	 * @param {number} ms milliseconds 
	 * @since v0.1.0
	 */
	sleep(ms: number) {
		delay(ms);
	}

	/**
	 * Draw a pixel in the canvas
	 * @param {RGBAColor} color the color of the pixel 
	 * @param {Position} position the position in the canvas
	 * @since v0.1.0
	 */
	drawPoint(color: RGBAColor, position: Position) {
		setPoint(this._renderer, color.red, color.green, color.blue, color.alpha, position.x, position.y);
	}

	/**
	 * Draw a line in the canvas
	 * @param {RGBAColor} color the color of the line
	 * @param {Position} from the starting position 
	 * @param {Position} to the ending
	 * @since v0.1.0
	 */
	drawLine(color: RGBAColor, from: Position, to: Position) {
		setLine(this._renderer, color.red, color.green, color.blue, color.alpha, from.x, from.y, to.x, to.y);
	}

	/**
	 * Draw an image from raw data on the canvas
	 * @param {Uint8Array} pixels the name of the image file
	 * @param {8 | 16 | 24 | 32} bitPerPixel the bit size of the color
	 * 	- 8 = 3 bit RED, 3 bit GREEN, 2 bit BLUE
	 *  - 16 = 5 bit RED, 6 bit GREEN, 5 bit BLUE
	 *  - 24 = 8 bit RED, 8 bit GREEN, 8 bit BLUE
	 *  - 32 = 8 bit RED, 8 bit GREEN, 8 bit BLUE, 8 bit alpha channel
	 * @since v0.1.9
	 */
	loadRawData(pixels: Uint8Array, bitPerPixel: 8 | 16 | 24 | 32 = 32) {
		if ((pixels.length / (bitPerPixel / 8)) !== this._height * this._width) throw "The buffer must be the same size as the window resolution";
		if (!(bitPerPixel === 8 || bitPerPixel === 16 || bitPerPixel === 24 || bitPerPixel === 32)) throw "The bitPerPixel param must be 8, 16, 24 or 32";
		throw "Not implementd";
	}

	/**
	 * Draw an image on the canvas
	 * @param {string} filename the name of the image file
	 * @since v0.1.9
	 */
	loadPNG(filename: string) {
		setPNG(this._renderer, filename);
	}

	/**
	 * Draw an image on the canvas
	 * @param {string} filename the name of the image file
	 * @since v0.1.9
	 */
	loadJPG(filename: string) {
		setJPG(this._renderer, filename);
	}

	/**
	 * Return the width of the window 
	 * @returns {number} the width of the window
	 * @since v0.1.0
	 */
	getWidth(): number { return this._width };

	/**
	 * Return the height of the window 
	 * @returns {number} the height of the window
	 * @since v0.1.0
	 */
	getHeight(): number { return this._height };

	/**
	 * Clear the canvas
	 * @since v0.1.3
	 */
	clear() {
		clearWithColor(this._renderer, 0, 0, 0, 255);
	}
}