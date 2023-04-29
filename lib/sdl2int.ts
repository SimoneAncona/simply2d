import { createRequire } from 'module';
import * as sdl from "./sdlValues.js"
const require = createRequire(import.meta.url);

const sdl2bind = require("../build/Release/canvas_sdl2.node");


export function getWindow(title: string, xPos: number, yPos: number, width: number, height: number, flags: number) {
	if (sdl2bind.init(sdl.SDL_Init_Everything) != 0) {
		throw "An error occurred while initializing SDL: " + sdl2bind.getError();
	}

	return sdl2bind.createWindow(title, xPos, yPos, width, height, flags) as ArrayBuffer;

}

export function getRenderer(window: ArrayBuffer, index: number, flag: number) {
	return sdl2bind.createRenderer(window, index, flag);
}

export function showWindow(window: ArrayBuffer) {
	sdl2bind.showWindow(window);
}

export function hideWindow(window: ArrayBuffer) {
	sdl2bind.hideWindow(window);
}

export function clearWithColor(renderer: ArrayBuffer, r: number, g: number, b: number, alpha: number) {
	sdl2bind.setDrawColor(renderer, r, g, b, alpha);
	sdl2bind.renderClear(renderer);
	sdl2bind.renderPresent(renderer);
}

export function delay(ms: number) {
	sdl2bind.delay(ms);
}

export function setPoint(renderer: ArrayBuffer, r: number, g: number, b: number, a: number, px: number, py: number) {
	sdl2bind.setDrawColor(renderer, r, g, b, a);
	sdl2bind.drawPoint(renderer, px, py);
	sdl2bind.renderPresent(renderer);
}

// export function _setRawData256(renderer: ArrayBuffer, buffer: Uint8Array, width: number, height: number) {
// 	let px = 0;
// 	let py = 0;
// 	for (let i = 0; i < buffer.length; i++) {
// 		let c = Colors.from8bit(buffer[i]);
// 		sdl.SDL2.SDL_SetRenderDrawColor(renderer, c.red, c.green, c.blue, c.alpha);
// 		sdl.SDL2.SDL_RenderDrawPoint(renderer, px, py);
// 		px++;
// 		if (px === width) {
// 			px = 0;
// 			py++;
// 		}
// 	}
// 	sdl.SDL2.SDL_RenderPresent(renderer);
// }

export function setLine(renderer: ArrayBuffer, r: number, g: number, b: number, a: number, px1: number, py1: number, px2: number, py2: number) {
	sdl2bind.setDrawColor(renderer, r, g, b, a);
	sdl2bind.drawLine(renderer, px1, py1, px2, py2);
	sdl2bind.renderPresent(renderer);
}

export function setImage(renderer: ArrayBuffer, filename: string, imgInitFlag: number) {
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

export function setPNG(renderer: ArrayBuffer, filename: string) {
	setImage(renderer, filename, sdl.IMG_Init_Flags.IMG_INIT_PNG);
}

export function setJPG(renderer: ArrayBuffer, filename: string) {
	setImage(renderer, filename, sdl.IMG_Init_Flags.IMG_INIT_JPG);
}

export function setRectangle(renderer: ArrayBuffer, x: number, y: number, width: number, height: number, r: number, g: number, b: number, a: number) {
	sdl2bind.setDrawColor(renderer, r, g, b, a);
	sdl2bind.drawRectangle(renderer, x, y, width, height);
	sdl2bind.renderPresent(renderer);
}

export function setRawData(renderer: ArrayBuffer, buffer: Uint8Array, bitPerPixel: number, width: number, height: number) {
	let pixelFormat = sdl.SDL_PIXEL_FORMAT.SDL_PIXELFORMAT_RGBA8888;
	if (bitPerPixel === 8) pixelFormat = sdl.SDL_PIXEL_FORMAT.SDL_PIXELFORMAT_RGB332;
	else if (bitPerPixel === 16) pixelFormat = sdl.SDL_PIXEL_FORMAT.SDL_PIXELFORMAT_RGB565;
	else if (bitPerPixel === 24) pixelFormat = sdl.SDL_PIXEL_FORMAT.SDL_PIXELFORMAT_RGB888;
	else pixelFormat = sdl.SDL_PIXEL_FORMAT.SDL_PIXELFORMAT_RGBA8888;

	let texture = sdl2bind.createTexture(renderer, pixelFormat, sdl.SDL_TEXTURE_ACCESS.SDL_TEXTUREACCESS_STREAMING, width, height);

	sdl2bind.writeTexture(texture, buffer);

	if (sdl2bind.renderCopy(renderer, texture, sdl.NULL, sdl.NULL) !== 0) {
		throw "Cannot load the texture into the renderer";
	};
    sdl2bind.renderPresent(renderer);
}
