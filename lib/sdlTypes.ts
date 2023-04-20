import * as ref from "ref-napi";
// var Struct = require('ref-struct');

export const VOID = ref.types.void;
export const VOIDPTR = ref.refType(VOID);
export const VOIDPTRPTR = ref.refType(VOIDPTR);
export const SDL2_Structure = ref.types.void;
export const SDL2_StructurePtr = ref.refType(SDL2_Structure);
export const SDL2_Window = ref.types.void;
export const SDL2_WindowPtr = ref.refType(SDL2_Window);
export const SDL2_Renderer = ref.types.void;
export const SDL2_RendererPtr = ref.refType(SDL2_Renderer);
export const SDL2_Surface = ref.types.void;
export const SDL2_SurfacePtr = ref.refType(SDL2_Surface);
export const SDL2_Texture = ref.types.void;
export const SDL2_TexturePtr = ref.refType(SDL2_Texture);
export const SDL2_Rect = ref.types.void;
export const SDL2_RectPtr = ref.refType(SDL2_Rect);
export const NULL = Buffer.alloc(4);