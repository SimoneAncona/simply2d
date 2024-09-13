export type CanvasOptions = {
    mode?: "fullscreen" | "minimized" | "maximized" | "hidden" | "shown";
    resizable?: boolean;
    scale?: number;
    antiAliasing?: boolean;
};
export type RGBAColor = {
    red: number;
    green: number;
    blue: number;
    alpha: number;
};
export type Position = {
    x: number;
    y: number;
};
export declare class PixelFormats {
    static get rgb332(): PixelFormat;
    static get rgb565(): PixelFormat;
    static get rgb888(): PixelFormat;
    static get rgba8888(): PixelFormat;
}
export type Layer = {
    id: string;
    isActive: boolean;
};
export type Key = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "Left Ctrl" | "Right Ctrl" | "Left Shift" | "Right Shift" | "Left Alt" | "Right Alt" | "Tab" | "Return" | "Escape" | "Backspace" | "Space" | "Up" | "Down" | "Left" | "Right";
export type Resolution = {
    w: number;
    h: number;
};
export type PixelFormat = 8 | 16 | 24 | 32;
