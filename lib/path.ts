import { Position, RGBAColor } from "./types.js";
import { Colors } from "./colors.js";

type SinglePath = {pos: Position, color: RGBAColor};

export class Path {
    protected _path: SinglePath[];

    constructor() {
        this._path = [];
    }

    /**
     * Set the starting position of the path
     * @param {Position} pos
     * @since v1.2.2 
     */
    setStart(pos: Position) {
        this._path[0] = {pos, color: Colors.TRANSPARENT};
    }

    /**
     * Push a new line
     * @param {RGBAColor} color the color of the line
     * @param {Position} pos the position of the last point of the line
     * @since v1.2.2 
     */
    pushLine(pos: Position, color: RGBAColor = Colors.WHITE) {
        this._path.push({pos, color});
    }

    /**
     * Close the path
     * @param {RGBAColor} color 
     * @since v1.2.2 
     */
    close(color: RGBAColor = Colors.WHITE) {
        this._path.push({pos: this._path[0].pos, color});
    }

    _getPath(): SinglePath[] { return this._path; }
}