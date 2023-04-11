import * as ffi from "ffi-napi";
import * as ref from "ref-napi";
import { getSDL2Lib } from "./getLibrary.js";
var SDL2_Structure = ref.types["void"];
var SDL2_StructurePtr = ref.refType(SDL2_Structure);
var SDL2_Window = ref.types["void"];
var SDL2_WindowPtr = ref.refType(SDL2_Window);
export var SDL_Init_Flags = {
    SDL_INIT_TIMER: 0x00000001,
    SDL_INIT_AUDIO: 0x00000010,
    SDL_INIT_VIDEO: 0x00000020,
    SDL_INIT_JOYSTICK: 0x00000200,
    SDL_INIT_HAPTIC: 0x00001000,
    SDL_INIT_GAMECONTROLLER: 0x00002000,
    SDL_INIT_EVENTS: 0x00004000,
    SDL_INIT_SENSOR: 0x00008000,
    SDL_INIT_NOPARACHUTE: 0x00100000
};
export var SDL_Init_Everything = SDL_Init_Flags.SDL_INIT_TIMER |
    SDL_Init_Flags.SDL_INIT_AUDIO |
    SDL_Init_Flags.SDL_INIT_VIDEO |
    SDL_Init_Flags.SDL_INIT_JOYSTICK |
    SDL_Init_Flags.SDL_INIT_HAPTIC |
    SDL_Init_Flags.SDL_INIT_GAMECONTROLLER |
    SDL_Init_Flags.SDL_INIT_EVENTS |
    SDL_Init_Flags.SDL_INIT_SENSOR |
    SDL_Init_Flags.SDL_INIT_NOPARACHUTE;
export var SDL_WindowPos = {
    SDL_WINDOWPOS_CENTERED: 0x2FFF0000,
    SDL_WINDOWPOS_UNDEFINED: 0x1FFF0000
};
export var SDL_Window_Flags = {
    SDL_WINDOW_FULLSCREEN: 0x00000001,
    SDL_WINDOW_OPENGL: 0x00000002,
    SDL_WINDOW_SHOWN: 0x00000004,
    SDL_WINDOW_HIDDEN: 0x00000008,
    SDL_WINDOW_BORDERLESS: 0x00000010,
    SDL_WINDOW_RESIZABLE: 0x00000020,
    SDL_WINDOW_MINIMIZED: 0x00000040,
    SDL_WINDOW_MAXIMIZED: 0x00000080,
    SDL_WINDOW_MOUSE_GRABBED: 0x00000100,
    SDL_WINDOW_INPUT_FOCUS: 0x00000200,
    SDL_WINDOW_MOUSE_FOCUS: 0x00000400,
    SDL_WINDOW_FOREIGN: 0x00000800,
    SDL_WINDOW_ALLOW_HIGHDPI: 0x00002000,
    SDL_WINDOW_MOUSE_CAPTURE: 0x00004000,
    SDL_WINDOW_ALWAYS_ON_TOP: 0x00008000,
    SDL_WINDOW_SKIP_TASKBAR: 0x00010000,
    SDL_WINDOW_UTILITY: 0x00020000,
    SDL_WINDOW_TOOLTIP: 0x00040000,
    SDL_WINDOW_POPUP_MENU: 0x00080000,
    SDL_WINDOW_KEYBOARD_GRABBED: 0x00100000,
    SDL_WINDOW_VULKAN: 0x10000000,
    SDL_WINDOW_METAL: 0x20000000
};
export var SDL2 = ffi.Library(getSDL2Lib(), {
    "SDL_Init": ["int", ["uint32"]],
    "SDL_Quit": ["void", ["void"]],
    "SDL_GetError": ["string", ["void"]],
    "SDL_CreateWindow": [SDL2_WindowPtr, ["string", "int", "int", "int", "int", "uint32"]],
    "SDL_Delay": ["void", ["uint32"]]
});
