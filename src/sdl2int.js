import * as sdl from "./sdl2bind.js";
export function getWindow(title, xPos, yPos, width, height, flags) {
    if (sdl.SDL2.SDL_Init(sdl.SDL_Init_Everything) != 0) {
        throw "An error occurred while initializing SDL: " + sdl.SDL2.SDL_GetError();
    }
    return sdl.SDL2.SDL_CreateWindow(title, xPos, yPos, width, height, flags);
}
export function getRenderer(window, index, flag) {
    return sdl.SDL2.SDL_CreateRenderer(window, index, flag);
}
export function showWindow(window) {
    sdl.SDL2.SDL_ShowWindow(window);
}
export function hideWindow(window) {
    sdl.SDL2.SDL_HideWindow(window);
}
export function clearWithColor(renderer, r, g, b, alpha) {
    sdl.SDL2.SDL_SetRenderDrawColor(renderer, r, g, b, alpha);
    sdl.SDL2.SDL_RenderClear(renderer);
    sdl.SDL2.SDL_RenderPresent(renderer);
}
export function delay(ms) {
    sdl.SDL2.SDL_Delay(ms);
}
export function setPoint(renderer, r, g, b, a, px, py) {
    sdl.SDL2.SDL_SetRenderDrawColor(renderer, r, g, b, a);
    sdl.SDL2.SDL_RenderDrawPoint(renderer, px, py);
    sdl.SDL2.SDL_RenderPresent(renderer);
}
export function setLine(renderer, r, g, b, a, px1, py1, px2, py2) {
    sdl.SDL2.SDL_SetRenderDrawColor(renderer, r, g, b, a);
    sdl.SDL2.SDL_RenderDrawLine(renderer, px1, py1, px2, py2);
    sdl.SDL2.SDL_RenderPresent(renderer);
}
