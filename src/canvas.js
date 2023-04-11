import { delay, getWindow } from "./sdl2int.js";
import { SDL_WindowPos, SDL_Window_Flags } from "./sdl2bind.js";
var Canvas = (function () {
    function Canvas(title, width, height, xPos, yPos, options) {
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
        this._window = getWindow(title, xPos, yPos, width, height, flags);
        delay(3000);
    }
    Canvas.prototype.show = function () {
    };
    Canvas.prototype.hide = function () {
    };
    return Canvas;
}());
export { Canvas };
