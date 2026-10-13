import { Position, Rectangle } from "./types.js";

export type Circle = Position & { radius: number };
export type RectangleContact = { depth: number; normal: Position; translation: Position };
function rectangle(rect: Rectangle): void {
    if (![rect.x, rect.y, rect.width, rect.height].every(Number.isFinite) || rect.width < 0 || rect.height < 0)
        throw new RangeError("Rectangle coordinates must be finite and dimensions nonnegative");
}
function circle(value: Circle): void {
    if (![value.x, value.y, value.radius].every(Number.isFinite) || value.radius < 0)
        throw new RangeError("Circle coordinates must be finite and radius nonnegative");
}
/** Axis-aligned rectangles. Edge contact counts only when touching is true. */
export function rectanglesOverlap(a: Rectangle, b: Rectangle, touching = false): boolean {
    rectangle(a); rectangle(b);
    if (!a.width || !a.height || !b.width || !b.height) return false;
    return touching
        ? a.x <= b.x + b.width && a.x + a.width >= b.x && a.y <= b.y + b.height && a.y + a.height >= b.y
        : a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
/** The positive-area intersection, or null when separated or only touching. */
export function rectangleIntersection(a: Rectangle, b: Rectangle): Rectangle | null {
    if (!rectanglesOverlap(a, b)) return null;
    const x = Math.max(a.x, b.x), y = Math.max(a.y, b.y);
    return { x, y, width: Math.min(a.x + a.width, b.x + b.width) - x,
        height: Math.min(a.y + a.height, b.y + b.height) - y };
}
/** The smallest axis-aligned translation that separates a from b. Does not mutate either. */
export function rectangleContact(a: Rectangle, b: Rectangle): RectangleContact | null {
    if (!rectanglesOverlap(a, b)) return null;
    const left = a.x + a.width - b.x, right = b.x + b.width - a.x;
    const up = a.y + a.height - b.y, down = b.y + b.height - a.y;
    const depth = Math.min(left, right, up, down);
    const normal = depth === left ? { x: -1, y: 0 } : depth === right ? { x: 1, y: 0 }
        : depth === up ? { x: 0, y: -1 } : { x: 0, y: 1 };
    return { depth, normal, translation: { x: normal.x * depth, y: normal.y * depth } };
}
/** Rectangle boundaries count by default. */
export function pointInRectangle(point: Position, rect: Rectangle, touching = true): boolean {
    rectangle(rect);
    if (![point.x, point.y].every(Number.isFinite)) throw new RangeError("Point coordinates must be finite");
    if (!rect.width || !rect.height) return false;
    return touching ? point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height
        : point.x > rect.x && point.x < rect.x + rect.width && point.y > rect.y && point.y < rect.y + rect.height;
}
export function circlesOverlap(a: Circle, b: Circle, touching = false): boolean {
    circle(a); circle(b);
    if (!a.radius || !b.radius) return false;
    const distance = Math.hypot(a.x - b.x, a.y - b.y), radius = a.radius + b.radius;
    return touching ? distance <= radius : distance < radius;
}
export function circleIntersectsRectangle(value: Circle, rect: Rectangle, touching = false): boolean {
    circle(value); rectangle(rect);
    if (!value.radius || !rect.width || !rect.height) return false;
    const x = Math.max(rect.x, Math.min(value.x, rect.x + rect.width));
    const y = Math.max(rect.y, Math.min(value.y, rect.y + rect.height));
    const distance = Math.hypot(value.x - x, value.y - y);
    return touching ? distance <= value.radius : distance < value.radius;
}
