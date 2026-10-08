import { AnimationOptions, Rectangle } from "./types.js";
export declare class SpriteAnimation {
    readonly textureID: string;
    readonly frames: readonly Readonly<Rectangle>[];
    readonly fps: number;
    readonly loop: boolean;
    private _index;
    private _elapsed;
    private _playing;
    private _finished;
    constructor(textureID: string, frames: readonly Rectangle[], options?: AnimationOptions);
    get frame(): Readonly<Rectangle>;
    get frameIndex(): number;
    get isPlaying(): boolean;
    get finished(): boolean;
    update(deltaMs: number): void;
    play(restart?: boolean): void;
    pause(): void;
    stop(): void;
    reset(): void;
}
export declare class SpriteSheet {
    readonly textureID: string;
    readonly frameWidth: number;
    readonly frameHeight: number;
    readonly columns: number;
    readonly rows: number;
    constructor(textureID: string, frameWidth: number, frameHeight: number, columns: number, rows: number);
    frame(index: number): Rectangle;
    animation(indexes: readonly number[], options?: AnimationOptions): SpriteAnimation;
}
