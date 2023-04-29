import { clearWithColor, delay, getRenderer, getWindow, hideWindow, setJPG, setLine, setPNG, setPoint, setRectangle, showWindow } from "./sdl2int.js";
import { SDL_WindowPos, SDL_Window_Flags } from "./sdlValues.js";
export class Canvas {
    _width;
    _height;
    _window;
    _renderer;
    constructor(windowTitle, width, height, xPos = SDL_WindowPos.SDL_WINDOWPOS_CENTERED, yPos = SDL_WindowPos.SDL_WINDOWPOS_CENTERED, options = {
        mode: "shown",
        resizable: false
    }) {
        let flags;
        this._width = width;
        this._height = height;
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
        this._window = getWindow(windowTitle, xPos, yPos, width, height, flags);
        console.log(this._window);
        this._renderer = getRenderer(this._window, -1, 0);
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
}
