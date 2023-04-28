import { getRenderer, getWindow } from "./sdl2int.js";
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
        else if (options.mode === "minimazied")
            flags |= SDL_Window_Flags.SDL_WINDOW_MINIMIZED;
        else if (options.mode === "shown")
            flags |= SDL_Window_Flags.SDL_WINDOW_SHOWN;
        this._window = getWindow(windowTitle, xPos, yPos, width, height, flags);
        this._renderer = getRenderer(this._window, -1, 0);
    }
}
