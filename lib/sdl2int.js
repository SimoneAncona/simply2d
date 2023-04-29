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
export function showWindow(window) {
    sdl2bind.showWindow(window);
}
export function hideWindow(window) {
    sdl2bind.hideWindow(window);
}
export function clearWithColor(renderer, r, g, b, alpha) {
    sdl2bind.setRenderDrawColor(renderer, r, g, b, alpha);
    sdl2bind.renderClear(renderer);
    sdl2bind.renderPresent(renderer);
}
export function delay(ms) {
    sdl2bind.delay(ms);
}
export function setPoint(renderer, r, g, b, a, px, py) {
    sdl2bind.setRenderDrawColor(renderer, r, g, b, a);
    sdl2bind.drawPoint(renderer, px, py);
    sdl2bind.renderPresent(renderer);
}
export function setLine(renderer, r, g, b, a, px1, py1, px2, py2) {
    sdl2bind.setRenderDrawColor(renderer, r, g, b, a);
    sdl2bind.drawLine(renderer, px1, py1, px2, py2);
    sdl2bind.renderPresent(renderer);
}
