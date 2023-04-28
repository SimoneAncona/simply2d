import { createRequire } from 'module';
import * as sdl from "./sdlValues.js";
const require = createRequire(import.meta.url);
const sdl2bind = require("../build/Debug/canvas_sdl2.node");
export function getWindow(title, xPos, yPos, width, height, flags) {
    if (sdl2bind.init(sdl.SDL_Init_Everything) != 0) {
        throw "An error occurred while initializing SDL: " + sdl2bind.getError();
    }
    return sdl2bind.createWindow(title, xPos, yPos, width, height, flags);
}
export function getRenderer(window, index, flag) {
    return sdl2bind.createRenderer(window, index, flag);
}
