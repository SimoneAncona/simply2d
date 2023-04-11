import * as ffi from "ffi-napi";
import { getSDL2ImageLib } from "./getLibrary.js";
import { SDL2_SurfacePtr } from "./sdlTypes.js";

export const SDL2_IMAGE = ffi.Library(getSDL2ImageLib(), {
	"IMG_Load": [SDL2_SurfacePtr, ["string"]]
});