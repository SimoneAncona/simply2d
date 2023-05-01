import { clearWithColor, delay, getRenderer, getWindow, hideWindow, saveJPG, savePNG, setJPG, setLine, setPNG, setPoint, setRawData, setRectangle, setRenderScale, showWindow, watchRawData } from "./sdl2int.js";
import { SDL_WindowPos, SDL_Window_Flags } from "./sdlValues.js";
export class Canvas {
    _width;
    _height;
    _window;
    _renderer;
    _currentBitPerPixel;
    constructor(windowTitle, width, height, xPos = SDL_WindowPos.SDL_WINDOWPOS_CENTERED, yPos = SDL_WindowPos.SDL_WINDOWPOS_CENTERED, options = {
        mode: "shown",
        resizable: false,
        scale: 1
    }) {
        let flags;
        this._width = width;
        this._height = height;
        if (xPos === 0 || xPos === undefined) {
            xPos = SDL_WindowPos.SDL_WINDOWPOS_CENTERED;
        }
        if (yPos === 0 || yPos === undefined) {
            yPos = SDL_WindowPos.SDL_WINDOWPOS_CENTERED;
        }
        if (options.mode === "fullscreen")
            flags |= SDL_Window_Flags.SDL_WINDOW_FULLSCREEN;
        else if (options.mode === "hidden")
            flags |= SDL_Window_Flags.SDL_WINDOW_HIDDEN;
        else if (options.mode === "maximized")
            flags |= SDL_Window_Flags.SDL_WINDOW_MAXIMIZED;
        else if (options.mode === "minimized")
            flags |= SDL_Window_Flags.SDL_WINDOW_MINIMIZED;
        else if (options.mode === "shown")
            flags |= SDL_Window_Flags.SDL_WINDOW_SHOWN;
        this._currentBitPerPixel = 32;
        this._window = getWindow(windowTitle, xPos, yPos, width, height, flags);
        this._renderer = getRenderer(this._window, -1, 0);
        setRenderScale(this._renderer, this._width, this._height, options.scale);
    }
    show() {
        showWindow(this._window);
    }
    hide() {
        hideWindow(this._window);
    }
    setBackgroundColor(color) {
        clearWithColor(this._renderer, color.red, color.green, color.blue, color.alpha);
    }
    sleep(ms) {
        delay(ms);
    }
    drawPoint(color, position) {
        setPoint(this._renderer, color.red, color.green, color.blue, color.alpha, position.x, position.y);
    }
    drawLine(color, from, to) {
        setLine(this._renderer, color.red, color.green, color.blue, color.alpha, from.x, from.y, to.x, to.y);
    }
    drawRectangle(color, center, width, height) {
        setRectangle(this._renderer, center.x, center.y, width, height, color.red, color.green, color.blue, color.alpha);
    }
    loadRawData(pixels, bitPerPixel = this._currentBitPerPixel) {
        if ((pixels.length / (bitPerPixel / 8)) !== this._height * this._width)
            throw "The buffer must be the same size as the window resolution";
        if (!(bitPerPixel === 8 || bitPerPixel === 16 || bitPerPixel === 24 || bitPerPixel === 32))
            throw "The bitPerPixel param must be 8, 16, 24 or 32";
        this._currentBitPerPixel = bitPerPixel;
        setRawData(this._renderer, pixels, bitPerPixel, this._width, this._height);
    }
    loadPNG(filename) {
        setPNG(this._renderer, filename);
    }
    loadJPG(filename) {
        setJPG(this._renderer, filename);
    }
    getWidth() { return this._width; }
    ;
    getHeight() { return this._height; }
    ;
    clear() {
        clearWithColor(this._renderer, 0, 0, 0, 255);
    }
    setBitPerPixel(bitPerPixel) {
        this._currentBitPerPixel = bitPerPixel;
    }
    getBitPerPixel() {
        return this._currentBitPerPixel;
    }
    getRawData() {
        return watchRawData(this._renderer, this._width, this._height);
    }
    dumpPNG(filename) {
        savePNG(this._renderer, this._width, this._height, filename);
    }
    dumpJPG(filename) {
        saveJPG(this._renderer, this._width, this._height, filename);
    }
}
