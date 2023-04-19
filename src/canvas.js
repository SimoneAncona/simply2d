import { clearWithColor, delay, getRenderer, getWindow, hideWindow, setJPG, setLine, setPNG, setPoint, setRawData, setRectangle, showWindow } from "./sdl2int.js";
import { SDL_WindowPos, SDL_Window_Flags } from "./sdl2bind.js";
var Canvas = (function () {
    function Canvas(windowTitle, width, height, xPos, yPos, options) {
        if (xPos === void 0) { xPos = SDL_WindowPos.SDL_WINDOWPOS_CENTERED; }
        if (yPos === void 0) { yPos = SDL_WindowPos.SDL_WINDOWPOS_CENTERED; }
        if (options === void 0) { options = {
            mode: "shown",
            resizable: false
        }; }
        var flags;
        this._width = width;
        this._height = height;
        if (options.mode === "fullscreen")
            flags |= SDL_Window_Flags.SDL_WINDOW_FULLSCREEN;
        else if (options.mode === "hidden")
            flags |= SDL_Window_Flags.SDL_WINDOW_HIDDEN;
        else if (options.mode === "maximized")
            flags |= SDL_Window_Flags.SDL_WINDOW_MAXIMIZED;
        else if (options.mode === "minimazied")
            flags |= SDL_Window_Flags.SDL_WINDOW_MINIMIZED;
        else if (options.mode === "shown")
            flags |= SDL_Window_Flags.SDL_WINDOW_SHOWN;
        this._window = getWindow(windowTitle, xPos, yPos, width, height, flags);
        this._renderer = getRenderer(this._window, -1, 0);
    }
    Canvas.prototype.show = function () {
        showWindow(this._window);
    };
    Canvas.prototype.hide = function () {
        hideWindow(this._window);
    };
    Canvas.prototype.setBackgroundColor = function (color) {
        clearWithColor(this._renderer, color.red, color.green, color.blue, color.alpha);
    };
    Canvas.prototype.sleep = function (ms) {
        delay(ms);
    };
    Canvas.prototype.drawPoint = function (color, position) {
        setPoint(this._renderer, color.red, color.green, color.blue, color.alpha, position.x, position.y);
    };
    Canvas.prototype.drawLine = function (color, from, to) {
        setLine(this._renderer, color.red, color.green, color.blue, color.alpha, from.x, from.y, to.x, to.y);
    };
    Canvas.prototype.drawRectangle = function (color, center, width, height) {
        setRectangle(this._renderer, center.x, center.y, width, height);
    };
    Canvas.prototype.loadRawData = function (pixels, bitPerPixel) {
        if (bitPerPixel === void 0) { bitPerPixel = 32; }
        if ((pixels.length / (bitPerPixel / 8)) !== this._height * this._width)
            throw "The buffer must be the same size as the window resolution";
        if (!(bitPerPixel === 8 || bitPerPixel === 16 || bitPerPixel === 24 || bitPerPixel === 32))
            throw "The bitPerPixel param must be 8, 16, 24 or 32";
        setRawData(this._renderer, pixels, bitPerPixel, this._width, this._height);
    };
    Canvas.prototype.loadPNG = function (filename) {
        setPNG(this._renderer, filename);
    };
    Canvas.prototype.loadJPG = function (filename) {
        setJPG(this._renderer, filename);
    };
    Canvas.prototype.getWidth = function () { return this._width; };
    ;
    Canvas.prototype.getHeight = function () { return this._height; };
    ;
    Canvas.prototype.clear = function () {
        clearWithColor(this._renderer, 0, 0, 0, 255);
    };
    return Canvas;
}());
export { Canvas };
