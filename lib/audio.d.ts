export type SoundOptions = {
    loop?: boolean;
    volume?: number;
};
export type PlaybackState = "playing" | "paused" | "stopped";
export declare class SoundPlayback {
    private readonly audio;
    readonly id: number;
    private _volume;
    constructor(audio: Audio, id: number, volume: number);
    get state(): PlaybackState;
    get isPlaying(): boolean;
    get volume(): number;
    set volume(value: number);
    pause(): void;
    resume(): void;
    stop(): void;
}
export declare class Audio {
    private readonly _device;
    private _closed;
    private _volume;
    private _paused;
    private readonly _durations;
    constructor();
    private checkOpen;
    get closed(): boolean;
    get paused(): boolean;
    get volume(): number;
    set volume(value: number);
    loadSound(id: string, source: string | Uint8Array): number;
    getSoundDuration(id: string): number;
    play(id: string, options?: SoundOptions): SoundPlayback;
    unloadSound(id: string): void;
    pause(): void;
    resume(): void;
    stopAll(): void;
    close(): void;
    playbackState(id: number): PlaybackState;
    control(id: number, action: "pause" | "resume" | "stop" | "volume", value?: number): void;
}
