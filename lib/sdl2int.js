import { createRequire } from 'module';
import * as sdl from "./sdlValues.js";
const require = createRequire(import.meta.url);
const sdl2bind = require("../build/Release/canvas_sdl2.node");
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
    sdl2bind.setDrawColor(renderer, r, g, b, alpha);
    sdl2bind.renderClear(renderer);
    sdl2bind.renderPresent(renderer);
}
export function delay(ms) {
    sdl2bind.delay(ms);
}
export function setPoint(renderer, r, g, b, a, px, py) {
    sdl2bind.setDrawColor(renderer, r, g, b, a);
    sdl2bind.drawPoint(renderer, px, py);
    sdl2bind.renderPresent(renderer);
}
export function setLine(renderer, r, g, b, a, px1, py1, px2, py2) {
    sdl2bind.setDrawColor(renderer, r, g, b, a);
    sdl2bind.drawLine(renderer, px1, py1, px2, py2);
    sdl2bind.renderPresent(renderer);
}
export function setImage(renderer, filename, imgInitFlag) {
    if (sdl2bind.imgInit(imgInitFlag) === 0) {
        throw "An error occurred while setting image: " + sdl2bind.getError();
    }
    let texture = sdl2bind.loadTexture(renderer, filename);
    if (texture === undefined) {
        throw "Cannot load texture from " + filename + ": " + sdl2bind.getError();
    }
    if (sdl2bind.renderCopy(renderer, texture, sdl.NULL, sdl.NULL) !== 0) {
        throw "Cannot load the texture into the renderer";
    }
    sdl2bind.renderPresent(renderer);
    sdl2bind.imgQuit();
}
export function setPNG(renderer, filename) {
    setImage(renderer, filename, sdl.IMG_Init_Flags.IMG_INIT_PNG);
}
export function setJPG(renderer, filename) {
    setImage(renderer, filename, sdl.IMG_Init_Flags.IMG_INIT_JPG);
}
export function setRectangle(renderer, x, y, width, height, r, g, b, a) {
    sdl2bind.setDrawColor(renderer, r, g, b, a);
    sdl2bind.drawRectangle(renderer, x, y, width, height);
}
export function setRawData(renderer, buffer, bitPerPixel, width, height) {
    let pixelFormat = sdl.SDL_PIXEL_FORMAT.SDL_PIXELFORMAT_RGBA8888;
    if (bitPerPixel === 8)
        pixelFormat = sdl.SDL_PIXEL_FORMAT.SDL_PIXELFORMAT_RGB332;
    else if (bitPerPixel === 16)
        pixelFormat = sdl.SDL_PIXEL_FORMAT.SDL_PIXELFORMAT_RGB565;
    else if (bitPerPixel === 24)
        pixelFormat = sdl.SDL_PIXEL_FORMAT.SDL_PIXELFORMAT_RGB888;
    else
        pixelFormat = sdl.SDL_PIXEL_FORMAT.SDL_PIXELFORMAT_RGBA8888;
    let texture = sdl2bind.createTexture(renderer, pixelFormat, sdl.SDL_TEXTURE_ACCESS.SDL_TEXTUREACCESS_STREAMING, width, height);
    sdl2bind.writeTexture(texture, buffer);
    if (sdl2bind.renderCopy(renderer, texture, sdl.NULL, sdl.NULL) !== 0) {
        throw "Cannot load the texture into the renderer";
    }
    ;
    sdl2bind.renderPresent(renderer);
}
