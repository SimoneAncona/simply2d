import { clearRenderingSequence, clearWithColor, delay, getRenderer, getTicks, getWindow, hideWindow, onClickEvent, onKeyDownEvent, onKeyUpEvent, onKeysDownEvent, onKeysUpEvent, refresh, renderPresent, saveJPG, savePNG, setJPG, setLine, setPNG, setPoint, setRawData, setRectangle, setRenderingSequence, showWindow, watchRawData, setAntialias, setText, setArc, sdl2bind, setTexture } from "./sdl2int.js";
import { SDL_PIXEL_FORMAT, SDL_WindowPos, SDL_Window_Flags } from "./sdlValues.js";
import { CanvasOptions, Key, PixelFormat, Position, RGBAColor, Resolution } from "./types.js";
import { Path } from "./path.js";
import fs from "fs";

export class Canvas {

	protected _width: number;
	protected _height: number;
	protected _window: ArrayBuffer;
	protected _renderer: ArrayBuffer;
	protected _currentBitPerPixel: PixelFormat;
	protected _scale: number;
	protected _startFrameTime: number;
	protected _frameTime: number;
	protected _loop: boolean;
	protected _fonts: { fontName: string, file: string }[];
	protected _textures: { textureID: string, file: string }[];
	private _currentFrametime: number;
	TOP_LEFT: Position;
	TOP_RIGHT: Position;
	TOP_CENTER: Position;
	CENTER_LEFT: Position;
	CENTER_RIGHT: Position;
	CENTER: Position;
	BOTTOM_LEFT: Position;
	BOTTOM_RIGHT: Position;
	BOTTOM_CENTER: Position;

	constructor(
		windowTitle: string,
		width: number,
		height: number,
		xPos: number = SDL_WindowPos.SDL_WINDOWPOS_CENTERED,
		yPos: number = SDL_WindowPos.SDL_WINDOWPOS_CENTERED,
		options: CanvasOptions = {
			mode: "shown",
			resizable: false,
			scale: 1,
			antiAliasing: true
		}
	) {
		if (options.mode === undefined) options.mode = "shown";
		if (options.resizable === undefined) options.resizable = false;
		if (options.scale === undefined) options.scale = 1;
		if (options.antiAliasing === undefined) options.antiAliasing = true;
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
		if (options.antiAliasing) {
			setAntialias();
		}
		if (options.mode === "fullscreen") flags |= SDL_Window_Flags.SDL_WINDOW_FULLSCREEN;
		else if (options.mode === "hidden") flags |= SDL_Window_Flags.SDL_WINDOW_HIDDEN;
		else if (options.mode === "maximized") flags |= SDL_Window_Flags.SDL_WINDOW_MAXIMIZED;
		else if (options.mode === "minimized") flags |= SDL_Window_Flags.SDL_WINDOW_MINIMIZED;
		else if (options.mode === "shown") flags |= SDL_Window_Flags.SDL_WINDOW_SHOWN;
		this._currentBitPerPixel = 32;
		this._window = getWindow(windowTitle, xPos, yPos, width * this._scale, height * this._scale, flags);
		this._renderer = getRenderer(this._window, -1, 0);
		this._frameTime = 2;
		this._fonts = [];
		this._textures = [];

		this.TOP_LEFT = {} as Position;
		this.TOP_CENTER = {} as Position;
		this.TOP_RIGHT = {} as Position;
		this.CENTER_LEFT = {} as Position;
		this.CENTER = {} as Position;
		this.CENTER_RIGHT = {} as Position;
		this.BOTTOM_LEFT = {} as Position;
		this.BOTTOM_CENTER = {} as Position;
		this.BOTTOM_RIGHT = {} as Position;
		Object.defineProperties(this.TOP_LEFT, { x: { value: 0, writable: false }, y: { value: 0, writable: false } });
		Object.defineProperties(this.TOP_CENTER, { x: { value: width / 2, writable: false }, y: { value: 0, writable: false } });
		Object.defineProperties(this.TOP_RIGHT, { x: { value: width, writable: false }, y: { value: 0, writable: false } });
		Object.defineProperties(this.CENTER_LEFT, { x: { value: 0, writable: false }, y: { value: height / 2, writable: false } });
		Object.defineProperties(this.CENTER, { x: { value: width / 2, writable: false }, y: { value: height / 2, writable: false } });
		Object.defineProperties(this.CENTER_RIGHT, { x: { value: width, writable: false }, y: { value: height / 2, writable: false } });
		Object.defineProperties(this.BOTTOM_LEFT, { x: { value: 0, writable: false }, y: { value: height, writable: false } });
		Object.defineProperties(this.BOTTOM_CENTER, { x: { value: width / 2, writable: false }, y: { value: height, writable: false } });
		Object.defineProperties(this.BOTTOM_RIGHT, { x: { value: width, writable: false }, y: { value: height, writable: false } });
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
	 * @param {Position} pos the top left corner of the rectangle
	 * @param {number} width the width 
	 * @param {number} height the height
	 * @param {boolean} fill fill the rectangle
	 * @since v0.1.10 (last update in v1.0.6)
	 * 
	 */
	drawRectangle(color: RGBAColor, pos: Position, width: number, height: number, fill: boolean = false) {
		pos = this._scalePosition(pos);
		width = width * this._scale;
		height = height * this._scale;
		setRectangle(this._renderer, pos.x, pos.y, width, height, color.red, color.green, color.blue, color.alpha, fill);
	}

	/**
	 * Draw an image from raw data on the canvas
	 * @param {Uint8Array} pixels the array of pixels
	 * @param {PixelFormat} bitPerPixel the bit size of the color
	 * 	- 8 = 3 bit RED, 3 bit GREEN, 2 bit BLUE
	 *  - 16 = 5 bit RED, 6 bit GREEN, 5 bit BLUE
	 *  - 24 = 8 bit RED, 8 bit GREEN, 8 bit BLUE
	 *  - 32 = 8 bit RED, 8 bit GREEN, 8 bit BLUE, 8 bit alpha channel
	 * @since v0.1.9
	 */
	loadRawData(pixels: Uint8Array, bitPerPixel: PixelFormat = this._currentBitPerPixel) {
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
	 * @param {PixelFormat} bitPerPixel the bit size of the color
	 * 	- 8 = 3 bit RED, 3 bit GREEN, 2 bit BLUE
	 *  - 16 = 5 bit RED, 6 bit GREEN, 5 bit BLUE
	 *  - 24 = 8 bit RED, 8 bit GREEN, 8 bit BLUE
	 *  - 32 = 8 bit RED, 8 bit GREEN, 8 bit BLUE, 8 bit alpha channel
	 * @since v1.0.4
	 */
	setBitPerPixel(bitPerPixel: PixelFormat) {
		this._currentBitPerPixel = bitPerPixel;
	}

	/**
	 * Get the current pixel format
	 * @returns {PixelFormat} the current pixel format
	 * @since v1.0.4
	 */
	getBitPerPixel(): PixelFormat {
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

	/**
	 * Start the rendering loop
	 * @param callback a repeated drawing process
	 * @since v1.0.8
	 */
	async loop(callback: () => void) {
		this._loop = true;
		while (this._loop) {
			let loopStartTime = new Date().getTime();
			setRenderingSequence();
			refresh(this._renderer);
			callback();
			renderPresent(this._renderer);
			this._currentFrametime = new Date().getTime() - loopStartTime;
		}
	}

	/**
	 * Get frame time
	 * @since v1.3.0
	 */
	get frameTime() {
		if (!this._loop) throw "Must render the scene with the loop function to get frametime";
		return this._currentFrametime;
	}

	/**
	 * Get fps
	 * @since v1.3.0
	 */
	get fps() {
		if (!this._loop) throw "Must render the scene with the loop function to get frametime";
		return 1000 / this._currentFrametime;
	}

	/**
	 * On keys down event
	 * @param {function} callback a function that takes the pressed key
	 * @since v1.0.8
	 */
	onKeysDown(callback: (keys: Key[]) => void): void {
		onKeysDownEvent(callback);
	}

	/**
	 * On keys up event
	 * @param {function} callback a function that takes the pressed key
	 * @since v1.0.8
	 */
	onKeysUp(callback: (keys: Key[]) => void): void {
		onKeysUpEvent(callback);
	}

	/**
	 * Draw an arc
	 * @param {number} radius the radius of the arc
	 * @param {number} startingAngle the starting angle (in radians) of the arc
	 * @param {number} endingAngle the ending angle (in radians) of the arc
	 * @param {Position} center the position of the arc
	 * @since v1.2.0
	 */
	drawArc(color: RGBAColor, center: Position, radius: number, startingAngle: number, endingAngle: number): void {
		setArc(this._renderer, center.x, center.y, radius, startingAngle, endingAngle, color.red, color.green, color.blue, color.alpha);
	}

	/**
	 * Draw text on the canvas
	 * @param {string} text the message 
	 * @param {string} fontName the font name (use loadFont to load a font from a tff file) 
	 * @param {number} size the size of the font 
	 * @param {Position} start the position of the text 
	 * @since v1.2.0
	 */
	drawText(text: string, fontName: string, size: number, color: RGBAColor, start: Position): void {
		sdl2bind.setFont(this._searchFont(fontName), size);
		setText(this._renderer, text, color.red, color.green, color.blue, start.x, start.y);
	}

	/**
	 * Load a new font from a TFF file
	 * @param {string} fontName the name of the font
	 * @param {string} filePath the file path
	 * @since v1.2.0
	 */
	loadFont(fontName: string, filePath: string): void {
		if (!fs.existsSync(filePath)) {
			throw "Cannot find the font file";
		}
		this._fonts.push({ fontName: fontName, file: filePath });
	}

	private _searchFont(fontName: string): string {
		for (let font of this._fonts) {
			if (font.fontName == fontName) {
				return font.file;
			}
		}
	}

	/**
	 * Convert polar coordinates into x, y coordinates
	 * @param {number} center 
	 * @param {number} angle 
	 * @param {number} radius 
	 * @returns {Position} converted coordinates
	 * @since v1.2.1
	 */
	convertPolarCoords(center: Position, angle: number, radius: number): Position {
		return { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius };
	}

	/**
	 * Load a texture from a file
	 * @param {string} textureID 
	 * @param {string} filePath 
	 * @since v1.2.1 (last update in v1.3)
	 */
	loadTexture(textureID: string, filePath: string): void {
		sdl2bind.loadTextureBuffer(this._renderer, textureID, filePath);
	}

	/**
	 * Draw a texture on the screen
	 * @param {string} textureID 
	 * @param {Position} pos top left corner of the box 
	 * @since v1.2.1 (last update in v1.3)
	 */
	drawTexture(textureID: string, pos: Position): void {
		setTexture(this._renderer, pos.x, pos.y, textureID);
	}


	/**
	 * Get the screen resolution
	 * @returns {Resolution} the screen resolution
	 * @since v1.2.1
	 */
	static getScreenResolution(): Resolution {
		return sdl2bind.getScreenRes() as Resolution;
	}

	/**
	 * Get the texture resolution
	 * @param {string} textureID the texture ID
	 * @since v1.2.1 (last update in v1.3)
	 */
	getTextureResolution(textureID: string): Resolution {
		return sdl2bind.getTextureRes(this._renderer, textureID) as Resolution;
	}

	/**
	 * Add a new layer to the scene
	 * @param {string} layerID ID of the layer
	 * @since v1.3.0
	 */
	addLayer(layerID: string, bitPerPixel: PixelFormat): void {
		let format;
		switch (bitPerPixel) {
			case 8:
				format = SDL_PIXEL_FORMAT.SDL_PIXELFORMAT_RGB332;
				break;
			case 16:
				format = SDL_PIXEL_FORMAT.SDL_PIXELFORMAT_RGB565;
				break;
			case 24:
				format = SDL_PIXEL_FORMAT.SDL_PIXELFORMAT_RGB888;
				break;
			case 32:
				format = SDL_PIXEL_FORMAT.SDL_PIXELFORMAT_RGBA8888;
				break;
		}
		sdl2bind.addLayer(this._renderer, layerID, format, this._width, this._height);
	}

	/**
	 * Change the layer to draw
	 * @param {string} layerID ID of the layer
	 * @since v1.3.0
	 */
	changeLayer(layerID: string) {
		sdl2bind.changeCurrentLayer(this._renderer, layerID);
	}

	/**
	 * Draw on the main layer (the canvas)
	 * @since v1.3.0
	 */
	useMainLayer() {
		sdl2bind.focusOutCurrentLayer(this._renderer);
	}

	/**
	 * Remove a layer
	 * @param {string} layerID
	 * @since v1.3.0
	 */
	removeLayer(layerID: string) {
		sdl2bind.removeLayer(layerID);
	}

	/**
	 * Draw a path
	 * @param {Path} path
	 * @param {Position} pos
	 * @param {RGBAColor} color
 	 * @since v1.2.2
	 */
	drawPath(path: Path, pos: Position = {x: 0, y: 0}, color?: RGBAColor) {
		const p = path._getPath();
		for (let i = 0; i < p.length - 1; i++) {
			this.drawLine(color === undefined ? p[i + 1].color : color, {x: p[i].pos.x + pos.x, y: p[i].pos.y + pos.y}, {x: p[i + 1].pos.x + pos.x, y: p[i + 1].pos.y + pos.y});
		}
	}
}