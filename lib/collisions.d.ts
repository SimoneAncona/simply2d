import { Position, Rectangle } from "./types.js";
export type Circle = Position & {
    radius: number;
};
export type RectangleContact = {
    depth: number;
    normal: Position;
    translation: Position;
};
export declare function rectanglesOverlap(a: Rectangle, b: Rectangle, touching?: boolean): boolean;
export declare function rectangleIntersection(a: Rectangle, b: Rectangle): Rectangle | null;
export declare function rectangleContact(a: Rectangle, b: Rectangle): RectangleContact | null;
export declare function pointInRectangle(point: Position, rect: Rectangle, touching?: boolean): boolean;
export declare function circlesOverlap(a: Circle, b: Circle, touching?: boolean): boolean;
export declare function circleIntersectsRectangle(value: Circle, rect: Rectangle, touching?: boolean): boolean;
