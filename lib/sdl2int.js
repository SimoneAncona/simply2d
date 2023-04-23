import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sdl2bind = require("../build/Release/canvas_sdl2.node");
console.log(sdl2bind);
import * as sdl from "./sdlValues.js";
export function getWindow(title, xPos, yPos, width, height, flags) {
    if (sdl2bind.sdlInit(sdl.SDL_Init_Everything) != 0) {
        throw "An error occurred while initializing SDL: " + sdl2bind.getError();
    }
    return sdl2bind.createWindow(title, xPos, yPos, width, height, flags);
}
