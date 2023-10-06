import { Position, RGBAColor } from "./types.js";
type SinglePath = {
    pos: Position;
    color: RGBAColor;
};
export declare class Path {
    protected _path: SinglePath[];
    constructor();
    setStart(pos: Position): void;
    pushLine(pos: Position, color?: RGBAColor): void;
    close(color?: RGBAColor): void;
    _getPath(): SinglePath[];
}
export {};
