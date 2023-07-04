import { clearRenderingSequence, clearWithColor, delay, getRenderer, getTicks, getWindow, hideWindow, onClickEvent, onKeyDownEvent, onKeyUpEvent, onKeysDownEvent, onKeysUpEvent, refresh, renderPresent, saveJPG, savePNG, setJPG, setLine, setPNG, setPoint, setRawData, setRectangle, setRenderingSequence, showWindow, watchRawData } from "./sdl2int.js";
import { SDL_WindowPos, SDL_Window_Flags } from "./sdlValues.js";
export class Canvas {
    _width;
    _height;
    _window;
    _renderer;
    _currentBitPerPixel;
    _scale;
    _startFrameTime;
    _frameTime;
    _loop;
    _attached;
    constructor(windowTitle, width, height, xPos = SDL_WindowPos.SDL_WINDOWPOS_CENTERED, yPos = SDL_WindowPos.SDL_WINDOWPOS_CENTERED, options = {
        mode: "shown",
        resizable: false,
        scale: 1
    }) {
        let flags;
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
        this._window = getWindow(windowTitle, xPos, yPos, width * this._scale, height * this._scale, flags);
        this._renderer = getRenderer(this._window, -1, 0);
        this._frameTime = 16;
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
        setPoint(this._renderer, color.red, color.green, color.blue, color.alpha, position.x * this._scale, position.y * this._scale);
    }
    drawLine(color, from, to) {
        from = this._scalePosition(from);
        to = this._scalePosition(to);
        setLine(this._renderer, color.red, color.green, color.blue, color.alpha, from.x, from.y, to.x, to.y);
    }
    drawRectangle(color, center, width, height, fill = false) {
        center = this._scalePosition(center);
        width = width * this._scale;
        height = height * this._scale;
        setRectangle(this._renderer, center.x, center.y, width, height, color.red, color.green, color.blue, color.alpha, fill);
    }
    loadRawData(pixels, bitPerPixel = this._currentBitPerPixel) {
        if ((pixels.length / (bitPerPixel / 8)) !== this._height * this._width)
            throw "The buffer must be the same size as the canvas resolution";
        if (!(bitPerPixel === 8 || bitPerPixel === 16 || bitPerPixel === 24 || bitPerPixel === 32))
            throw "The bitPerPixel param must be 8, 16, 24 or 32";
        this._currentBitPerPixel = bitPerPixel;
        pixels = this._scaleRawData(pixels);
        setRawData(this._renderer, pixels, bitPerPixel, this._width * this._scale, this._height * this._scale);
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
    _scalePosition(pos) {
        return { x: pos.x * this._scale, y: pos.y * this._scale };
    }
    _scaleRawData(rawData) {
        let newRawData = new Uint8Array(rawData.length * this._scale ** 2);
        for (let i = 0; i < rawData.length; i++) {
            let indexes = this._getScaledIndexes(i);
            console.log;
            for (let index of indexes) {
                newRawData[index] = rawData[i];
            }
        }
        return newRawData;
    }
    _getScaledIndexes(index) {
        let indexes = [];
        index = index * this._scale + (Math.floor(index / this._width) * this._width * this._scale);
        for (let i = 0; i < this._scale; i++) {
            for (let j = 0; j < this._scale; j++) {
                indexes.push(index + i + (j * this._width * this._scale));
            }
        }
        return indexes;
    }
    getScale() {
        return this._scale;
    }
    onClick(callback) {
        onClickEvent(callback);
    }
    onKeyDown(callback) {
        onKeyDownEvent(callback);
    }
    onKeyUp(callback) {
        onKeyUpEvent(callback);
    }
    initRenderSequence() {
        setRenderingSequence();
        this._startFrameTime = getTicks();
    }
    exposeRender() {
        clearRenderingSequence();
        renderPresent(this._renderer);
    }
    waitFrame() {
        delay(this._frameTime - (this._startFrameTime - getTicks()));
    }
    async loop(callback) {
        this._loop = true;
        this._attached = false;
        while (this._loop) {
            setRenderingSequence();
            refresh(this._renderer);
            callback();
            renderPresent(this._renderer);
        }
    }
    onKeysDown(callback) {
        onKeysDownEvent(callback);
    }
    onKeysUp(callback) {
        onKeysUpEvent(callback);
    }
}
