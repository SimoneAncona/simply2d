import * as sdl from "./sdl2bind.js";
export function getWindow(title, xPos, yPos, width, height, flags) {
    if (sdl.SDL2.SDL_Init(sdl.SDL_Init_Everything) != 0) {
        throw "An error occurred while initializing SDL: " + sdl.SDL2.SDL_GetError();
    }
    return sdl.SDL2.SDL_CreateWindow(title, xPos, yPos, width, height, flags);
}
export function delay(ms) {
    sdl.SDL2.SDL_Delay(ms);
}
