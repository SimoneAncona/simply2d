import { Key } from './types.js';
export declare const sdl2bind: any;
export declare function getTicks(): any;
export declare function setRenderingSequence(): void;
export declare function clearRenderingSequence(): void;
export declare function getWindow(title: string, xPos: number, yPos: number, width: number, height: number, flags: number): ArrayBuffer;
export declare function getRenderer(window: ArrayBuffer, index: number, flag: number): any;
export declare function showWindow(window: ArrayBuffer): void;
export declare function hideWindow(window: ArrayBuffer): void;
export declare function clearWithColor(renderer: ArrayBuffer, r: number, g: number, b: number, alpha: number): void;
export declare function getCurrentLayer(): void;
export declare function delay(ms: number): void;
export declare function setPoint(renderer: ArrayBuffer, r: number, g: number, b: number, a: number, px: number, py: number): void;
export declare function setLine(renderer: ArrayBuffer, r: number, g: number, b: number, a: number, px1: number, py1: number, px2: number, py2: number): void;
export declare function setAntialias(): void;
export declare function setImage(renderer: ArrayBuffer, filename: string, imgInitFlag: number): void;
export declare function setPNG(renderer: ArrayBuffer, filename: string): void;
export declare function setJPG(renderer: ArrayBuffer, filename: string): void;
export declare function setRectangle(renderer: ArrayBuffer, x: number, y: number, width: number, height: number, r: number, g: number, b: number, a: number, fill: boolean): void;
export declare function renderPresent(renderer: ArrayBuffer): void;
export declare function setRawData(renderer: ArrayBuffer, buffer: Uint8Array, bitPerPixel: number, width: number, height: number): void;
export declare function watchRawData(renderer: ArrayBuffer, width: number, height: number): Uint8Array;
export declare function savePNG(renderer: ArrayBuffer, width: number, height: number, filename: string): void;
export declare function saveJPG(renderer: ArrayBuffer, width: number, height: number, filename: string): void;
export declare function setRenderScale(renderer: ArrayBuffer, width: number, height: number, scale: number): void;
export declare function onClickEvent(callback: (x: number, y: number) => void): void;
export declare function onKeyDownEvent(callback: (key: Key) => void): void;
export declare function onKeyUpEvent(callback: (key: Key) => void): void;
export declare function onKeysDownEvent(callback: (key: Key[]) => void): void;
export declare function onKeysUpEvent(callback: (key: Key[]) => void): void;
export declare function refresh(renderer: ArrayBuffer): void;
export declare function setText(renderer: ArrayBuffer, text: string, r: number, g: number, b: number, x: number, y: number): void;
export declare function setArc(renderer: ArrayBuffer, x: number, y: number, radius: number, angle1: number, angle2: number, r: number, g: number, b: number, a: number): void;
export declare function setTexture(renderer: ArrayBuffer, x: number, y: number, textureFile: string): void;
