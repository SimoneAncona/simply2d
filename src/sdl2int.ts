import { Pointer } from "ref-napi";
import * as sdl from "./sdl2bind.js";

export function getWindow(title: string, xPos: number, yPos: number, width: number, height: number, flags: number) {
	if (sdl.SDL2.SDL_Init(sdl.SDL_Init_Everything) != 0) {
		throw "An error occurred while initializing SDL: " + sdl.SDL2.SDL_GetError()
	}

	return sdl.SDL2.SDL_CreateWindow(title, xPos, yPos, width, height, flags);

}

export function getRenderer(window: Pointer<void>, index: number, flag: number) {
	return sdl.SDL2.SDL_CreateRenderer(window, index, flag);
}

export function showWindow(window: Pointer<void>) {
	sdl.SDL2.SDL_ShowWindow(window);
}

export function hideWindow(window: Pointer<void>) {
	sdl.SDL2.SDL_HideWindow(window);
}

export function clearWithColor(renderer: Pointer<void>, r: number, g: number, b: number, alpha: number) {
	sdl.SDL2.SDL_SetRenderDrawColor(renderer, r, g, b, alpha);
	sdl.SDL2.SDL_RenderClear(renderer);
	sdl.SDL2.SDL_RenderPresent(renderer);
}

export function delay(ms: number) {
	sdl.SDL2.SDL_Delay(ms);
}

export function setPoint(renderer: Pointer<void>, r: number, g: number, b: number, a: number, px: number, py: number) {
	sdl.SDL2.SDL_SetRenderDrawColor(renderer, r, g, b, a);
	sdl.SDL2.SDL_RenderDrawPoint(renderer, px, py);
	sdl.SDL2.SDL_RenderPresent(renderer);
}

export function setLine(renderer: Pointer<void>, r: number, g: number, b: number, a: number, px1: number, py1: number, px2: number, py2: number) {
	sdl.SDL2.SDL_SetRenderDrawColor(renderer, r, g, b, a);
	sdl.SDL2.SDL_RenderDrawLine(renderer, px1, py1, px2, py2);
	sdl.SDL2.SDL_RenderPresent(renderer);
}