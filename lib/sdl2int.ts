import { createRequire } from 'module';
import * as sdl from "./sdlValues.js"
import { Key } from './types.js';
const require = createRequire(import.meta.url);
let sdl2bind: any;
try {
	sdl2bind = require("../build/Release/canvas_sdl2.node");
} catch {
	sdl2bind = require("../build/Debug/canvas_sdl2.node");
}
export { sdl2bind }
let renderingSequence = false;

export function getTicks() {
	return sdl2bind.getTicks();
}

export async function setRenderingSequence() {
	renderingSequence = true;
}

export async function clearRenderingSequence() {
	renderingSequence = false;
}

export function getWindow(title: string, xPos: number, yPos: number, width: number, height: number, flags: number, scale: number) {
	if (sdl2bind.init(sdl.SDL_Init_Everything) != 0) {
		throw "An error occurred while initializing SDL: " + sdl2bind.getError();
	}

	return sdl2bind.createWindow(title, xPos, yPos, width, height, flags, scale) as ArrayBuffer;
}

export function getRenderer(window: ArrayBuffer, index: number, flag: number) {
	if (window === undefined) {
		throw "Cannot create a window";
	}
	return sdl2bind.createRenderer(window, index, flag) as ArrayBuffer;
}

export function render(renderer: ArrayBuffer) {
	if (renderingSequence)
		return;
	sdl2bind.renderLayers(renderer);
	sdl2bind.renderPresent(renderer);
}

export async function clearWithColor(renderer: ArrayBuffer, r: number, g: number, b: number, alpha: number) {
	sdl2bind.setDrawColor(renderer, r, g, b, alpha);
	sdl2bind.renderClear(renderer);
	render(renderer);
}

export async function setPoint(renderer: ArrayBuffer, r: number, g: number, b: number, a: number, px: number, py: number) {
	sdl2bind.setDrawColor(renderer, r, g, b, a);
	sdl2bind.drawPoint(renderer, px, py);
	render(renderer);
}

export async function setLine(renderer: ArrayBuffer, r: number, g: number, b: number, a: number, px1: number, py1: number, px2: number, py2: number) {
	sdl2bind.setDrawColor(renderer, r, g, b, a);
	sdl2bind.drawLine(renderer, px1, py1, px2, py2);
	render(renderer);
}

export async function setAntialias() {
	sdl2bind.setAntialias();
}

export async function setImage(renderer: ArrayBuffer, filename: string, imgInitFlag: number) {
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
	render(renderer);
	sdl2bind.imgQuit();
}

export async function setPNG(renderer: ArrayBuffer, filename: string) {
	setImage(renderer, filename, sdl.IMG_Init_Flags.IMG_INIT_PNG);
}

export async function setJPG(renderer: ArrayBuffer, filename: string) {
	setImage(renderer, filename, sdl.IMG_Init_Flags.IMG_INIT_JPG);
}

export async function setRectangle(renderer: ArrayBuffer, x: number, y: number, width: number, height: number, r: number, g: number, b: number, a: number, fill: boolean) {
	sdl2bind.setDrawColor(renderer, r, g, b, a);
	sdl2bind.drawRectangle(renderer, x, y, width, height, fill);
	render(renderer);
}

export async function renderPresent(renderer: ArrayBuffer) {
	sdl2bind.renderLayers(renderer);
	sdl2bind.renderPresent(renderer);
}

export async function setRawData(renderer: ArrayBuffer, buffer: Uint8Array, bitPerPixel: number, width: number, height: number) {
	let pixelFormat = sdl.SDL_PIXEL_FORMAT.SDL_PIXELFORMAT_RGBA8888;
	if (bitPerPixel === 8) pixelFormat = sdl.SDL_PIXEL_FORMAT.SDL_PIXELFORMAT_RGB332;
	else if (bitPerPixel === 16) pixelFormat = sdl.SDL_PIXEL_FORMAT.SDL_PIXELFORMAT_RGB565;
	else if (bitPerPixel === 24) pixelFormat = sdl.SDL_PIXEL_FORMAT.SDL_PIXELFORMAT_RGB888;

	let texture = sdl2bind.createTexture(renderer, pixelFormat, sdl.SDL_TEXTURE_ACCESS.SDL_TEXTUREACCESS_STREAMING, width, height);

	sdl2bind.writeTexture(texture, buffer);

	if (sdl2bind.renderCopy(renderer, texture, sdl.NULL, sdl.NULL) !== 0) {
		throw "Cannot load the texture into the renderer";
	};

	sdl2bind.deleteTexture(texture);
	render(renderer);
}

export function watchRawData(renderer: ArrayBuffer, width: number, height: number): Uint8Array {
	return new Uint8Array(sdl2bind.readData(renderer, width, height));
}

export async function savePNG(renderer: ArrayBuffer, width: number, height: number, filename: string) {
	sdl2bind.savePNG(renderer, width, height, filename);
}

export async function saveJPG(renderer: ArrayBuffer, width: number, height: number, filename: string) {
	sdl2bind.saveJPG(renderer, width, height, filename);
}

export async function setRenderScale(renderer: ArrayBuffer, width: number, height: number, scale: number) {
	sdl2bind.setScale(renderer, width, height, scale);
}

export async function onClickEvent(callback: (x: number, y: number) => void) {
	sdl2bind.onClick(callback);
}

export async function onKeyDownEvent(callback: (key: Key) => void) {
	sdl2bind.onKeyDown(callback);
}

export async function onKeyUpEvent(callback: (key: Key) => void) {
	sdl2bind.onKeyUp(callback);
}

export async function onKeysDownEvent(callback: (key: Key[]) => void) {
	sdl2bind.onKeysDown(callback);
}

export async function onKeysUpEvent(callback: (key: Key[]) => void) {
	sdl2bind.onKeysUp(callback);
}

export async function refresh(renderer: ArrayBuffer) {
	sdl2bind.setDrawColor(renderer, 0, 0, 0, 255);
	sdl2bind.renderClear(renderer);
}

export async function setText(renderer: ArrayBuffer, text: string, r: number, g: number, b: number, x: number, y: number) {
	sdl2bind.drawText(renderer, text, r, g, b, x, y);
	render(renderer);
}

export async function setArc(renderer: ArrayBuffer, x: number, y: number, radius: number, angle1: number, angle2: number, r: number, g: number, b: number, a: number) {
	sdl2bind.setDrawColor(renderer, r, g, b, a);
	sdl2bind.drawArc(renderer, x, y, radius, angle1, angle2);
	render(renderer);
}

export async function setTexture(renderer: ArrayBuffer, x: number, y: number, textureFile: string) {
	sdl2bind.drawTexture(renderer, x, y, textureFile);
	render(renderer);
}