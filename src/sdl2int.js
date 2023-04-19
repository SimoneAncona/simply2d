import * as sdl from "./sdl2bind.js";
import * as image from "./sdl2imageBind.js";
import { NULL } from "./sdlTypes.js";
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
export function setImage(renderer, filename, imgInitFlag) {
    if (image.SDL2_IMAGE.IMG_Init(imgInitFlag) === 0) {
        throw "An error occurred while setting image: " + sdl.SDL2.SDL_GetError();
    }
    var texture = image.SDL2_IMAGE.IMG_LoadTexture(renderer, filename);
    if (texture.isNull()) {
        throw "Cannot load texture from " + filename + ": " + sdl.SDL2.SDL_GetError();
    }
    if (sdl.SDL2.SDL_RenderCopy(renderer, texture, NULL, NULL) !== 0) {
        throw "Cannot load the texture into the renderer";
    }
    sdl.SDL2.SDL_RenderPresent(renderer);
    image.SDL2_IMAGE.IMG_Quit();
}
export function setPNG(renderer, filename) {
    setImage(renderer, filename, image.IMG_Init_Flags.IMG_INIT_PNG);
}
export function setJPG(renderer, filename) {
    setImage(renderer, filename, image.IMG_Init_Flags.IMG_INIT_JPG);
}
export function setRawData(renderer, buffer, bitPerPixel, width, height) {
    var pixelFormat = image.SDL_PIXEL_FORMAT.SDL_PIXELFORMAT_RGBA8888;
    if (bitPerPixel === 8)
        pixelFormat = image.SDL_PIXEL_FORMAT.SDL_PIXELFORMAT_RGB332;
    else if (bitPerPixel === 16)
        pixelFormat = image.SDL_PIXEL_FORMAT.SDL_PIXELFORMAT_RGB565;
    else
        pixelFormat = image.SDL_PIXEL_FORMAT.SDL_PIXELFORMAT_RGB888;
    var texture = sdl.SDL2.SDL_CreateTexture(renderer, pixelFormat, image.SDL_TEXTURE_ACCESS.SDL_TEXTUREACCESS_STREAMING, width, height);
    var buff = Buffer.from(buffer);
    var int = Buffer.allocUnsafe(4);
    int.writeInt32LE(width * bitPerPixel / 8);
    if (sdl.SDL2.SDL_LockTexture(texture, NULL, buff.ref(), int.ref()) !== 0) {
        throw "Cannot draw the texture";
    }
    ;
    sdl.SDL2.SDL_UnlockTexture(texture);
    if (sdl.SDL2.SDL_RenderCopy(renderer, texture, NULL, NULL) !== 0) {
        throw "Cannot load the texture into the renderer";
    }
    ;
    sdl.SDL2.SDL_RenderPresent(renderer);
    _debug();
}
function _debug() {
    console.log(sdl.SDL2.SDL_GetError());
}
