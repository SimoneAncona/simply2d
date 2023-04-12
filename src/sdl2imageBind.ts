import * as ffi from "ffi-napi";
import { getSDL2ImageLib } from "./getLibrary.js";
import { SDL2_RendererPtr, SDL2_SurfacePtr, SDL2_TexturePtr } from "./sdlTypes.js";

export const IMG_Init_Flags = {
	IMG_INIT_JPG: 0x00000001,
	IMG_INIT_PNG: 0x00000002,
	IMG_INIT_TIF: 0x00000004,
	IMG_INIT_WEBP: 0x00000008,
	IMG_INIT_JXL: 0x00000010,
	IMG_INIT_AVIF: 0x00000020
}

export const SDL2_IMAGE = ffi.Library(getSDL2ImageLib(), {
	"IMG_Load": [SDL2_SurfacePtr, ["string"]],
	"IMG_Init": ["int", ["int"]],
	"IMG_Quit": ["void", ["void"]],
	"IMG_GetError": ["string", ["void"]],
	"IMG_LoadTexture": [SDL2_TexturePtr, [SDL2_RendererPtr, "string"]]
});