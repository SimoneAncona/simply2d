import { clearRenderingSequence, clearWithColor, delay, getRenderer, getTicks, getWindow, hideWindow, onClickEvent, onKeyDownEvent, onKeyUpEvent, renderPresent, saveJPG, savePNG, setJPG, setLine, setPNG, setPoint, setRawData, setRectangle, setRenderScale, setRenderingSequence, showWindow, watchRawData } from "./sdl2int.js";
import { SDL_WindowPos, SDL_Window_Flags } from "./sdlValues.js";
import { CanvasOptions, Key, Position, RGBAColor } from "./types.js";

export class Canvas {

	_width: number;
	_height: number;
	_window: ArrayBuffer;
	_renderer: ArrayBuffer;
	_currentBitPerPixel: 8 | 16 | 24 | 32;
	_scale: number;
	_startFrameTime: number;
	_frameTime: number;

	constructor(
		windowTitle: string,
		width: number,
		height: number,
		xPos: number = SDL_WindowPos.SDL_WINDOWPOS_CENTERED,
		yPos: number = SDL_WindowPos.SDL_WINDOWPOS_CENTERED,
		options: CanvasOptions = {
			mode: "shown",
			resizable: false,
			scale: 1
		}
	) {
		let flags: number;
		this._width = width;
		this._height = height;
		this._scale = Math.floor(options.scale);
		if (xPos === 0 || xPos === undefined) {
			xPos = SDL_WindowPos.SDL_WINDOWPOS_CENTERED;
		}
		if (yPos === 0 || yPos === undefined) {
			yPos = SDL_WindowPos.SDL_WINDOWPOS_CENTERED;
		}
		flags = SDL_Window_Flags.SDL_WINDOW_SHOWN;
		if (options.mode === "fullscreen") flags |= SDL_Window_Flags.SDL_WINDOW_FULLSCREEN;
		else if (options.mode === "hidden") flags |= SDL_Window_Flags.SDL_WINDOW_HIDDEN;
		else if (options.mode === "maximized") flags |= SDL_Window_Flags.SDL_WINDOW_MAXIMIZED;
		else if (options.mode === "minimized") flags |= SDL_Window_Flags.SDL_WINDOW_MINIMIZED;
		else if (options.mode === "shown") flags |= SDL_Window_Flags.SDL_WINDOW_SHOWN;
		this._currentBitPerPixel = 32;
		this._window = getWindow(windowTitle, xPos, yPos, width * this._scale, height * this._scale, flags);
		this._renderer = getRenderer(this._window, -1, 0);
		this._frameTime = 16;
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
		setPoint(this._renderer, color.red, color.green, color.blue, color.alpha, position.x * this._scale, position.y * this._scale);
	}

	/**
	 * Draw a line in the canvas
	 * @param {RGBAColor} color the color of the line
	 * @param {Position} from the starting position 
	 * @param {Position} to the ending
	 * @since v0.1.0
	 */
	drawLine(color: RGBAColor, from: Position, to: Position) {
		from = this._scalePosition(from);
		to = this._scalePosition(to);
		setLine(this._renderer, color.red, color.green, color.blue, color.alpha, from.x, from.y, to.x, to.y);
	}

	/**
	 * Draw a rectangle
	 * @param {RGBAColor} color the border color
	 * @param {Position} center the center of the rectangle
	 * @param {number} width the width 
	 * @param {number} height the height
	 * @param {boolean} fill fill the rectangle
	 * @since v0.1.10 (updated in v1.0.6)
	 * 
	 */
	drawRectangle(color: RGBAColor, center: Position, width: number, height: number, fill: boolean = false) {
		center = this._scalePosition(center);
		width = width * this._scale;
		height = height * this._scale;
		setRectangle(this._renderer, center.x, center.y, width, height, color.red, color.green, color.blue, color.alpha, fill);
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
	loadRawData(pixels: Uint8Array, bitPerPixel: 8 | 16 | 24 | 32 = this._currentBitPerPixel) {
		if ((pixels.length / (bitPerPixel / 8)) !== this._height * this._width) throw "The buffer must be the same size as the canvas resolution";
		if (!(bitPerPixel === 8 || bitPerPixel === 16 || bitPerPixel === 24 || bitPerPixel === 32)) throw "The bitPerPixel param must be 8, 16, 24 or 32";
		this._currentBitPerPixel = bitPerPixel;
		pixels = this._scaleRawData(pixels);
		setRawData(this._renderer, pixels, bitPerPixel, this._width * this._scale, this._height * this._scale);
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

	/**
	 * Set the current pixel format
	 * @param {8 | 16 | 24 | 32} bitPerPixel the bit size of the color
	 * 	- 8 = 3 bit RED, 3 bit GREEN, 2 bit BLUE
	 *  - 16 = 5 bit RED, 6 bit GREEN, 5 bit BLUE
	 *  - 24 = 8 bit RED, 8 bit GREEN, 8 bit BLUE
	 *  - 32 = 8 bit RED, 8 bit GREEN, 8 bit BLUE, 8 bit alpha channel
	 * @since v1.0.4
	 */
	setBitPerPixel(bitPerPixel: 8 | 16 | 24 | 32) {
		this._currentBitPerPixel = bitPerPixel;
	}

	/**
	 * Get the current pixel format
	 * @returns {8 | 16 | 24 | 32} the current pixel format
	 * @since v1.0.4
	 */
	getBitPerPixel(): 8 | 16 | 24 | 32 {
		return this._currentBitPerPixel;
	}

	/**
	 * Get the video buffer
	 * @returns {Uint8Array} the video buffer
	 * @since v1.0.4
	 */
	getRawData(): Uint8Array {
		return watchRawData(this._renderer, this._width, this._height);
	}

	/**
	 * Save a screenshot of the render
	 * @param {string} filename the file 
	 * @since v1.0.4
	 */
	dumpPNG(filename: string) {
		savePNG(this._renderer, this._width, this._height, filename);
	}

	/**
	 * Save a screenshot of the render
	 * @param {string} filename the file 
	 * @since v1.0.4
	 */
	dumpJPG(filename: string) {
		saveJPG(this._renderer, this._width, this._height, filename);
	}

	/**
	 * @since v1.0.5
	 */
	private _scalePosition(pos: Position) {
		return { x: pos.x * this._scale, y: pos.y * this._scale } as Position;
	}

	/**
	 * @since v.1.0.5
	 */
	private _scaleRawData(rawData: Uint8Array) {
		let newRawData = new Uint8Array(rawData.length * this._scale ** 2);
		for (let i = 0; i < rawData.length; i++) {
			let indexes = this._getScaledIndexes(i);
			console.log
			for (let index of indexes) {
				newRawData[index] = rawData[i];
			}
		}
		return newRawData;
	}

	private _getScaledIndexes(index: number) {
		let indexes = [];
		index = index * this._scale + (Math.floor(index / this._width) * this._width * this._scale);

		for (let i = 0; i < this._scale; i++) {
			for (let j = 0; j < this._scale; j++) {
				indexes.push(index + i + (j * this._width * this._scale));
			}
		}

		return indexes;
	}

	/**
	 * Get the scale factor
	 * @returns {number} scale factor
	 * @since v1.0.5
	 */
	getScale(): number {
		return this._scale;
	}

	/**
	 * On click event
	 * @param {function} callback a function that takes x and y coordinates
	 * @since v1.0.6
	 */
	onClick(callback: (x: number, y: number) => void): void {
		onClickEvent(callback);
	}

	/**
	 * On key down event
	 * @param {function} callback a function that takes the pressed key
	 * @since v1.0.6
	 */
	onKeyDown(callback: (key: Key) => void): void {
		onKeyDownEvent(callback);
	}

	/**
	 * On key up event
	 * @param {function} callback a function that takes the pressed key
	 * @since v1.0.6
	 */
	onKeyUp(callback: (key: Key) => void): void {
		onKeyUpEvent(callback);
	}

	/**
	 * It is used to initialize the rendering sequence. 
	 * Every drawing process will not be displayed until exposeRender is called
	 * @since v1.0.8
	 */
	initRenderSequence() {
		setRenderingSequence();
		this._startFrameTime = getTicks();
	}

	/**
	 * Shows the rendering
	 * @since v1.0.8
	 */
	exposeRender() {
		clearRenderingSequence();
		renderPresent(this._renderer);
	}

	/**
	 * Sleep for a certain time before the next frame is rendered
	 * @since v1.0.8
	 */
	waitFrame() {
		delay(this._frameTime - (this._startFrameTime - getTicks()));
	}
}