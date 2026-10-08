import { sdl2bind } from "./sdl2int.js";

export type SoundOptions = { loop?: boolean; volume?: number };
export type PlaybackState = "playing" | "paused" | "stopped";
function volumeValue(value: number): number {
    if (!Number.isFinite(value) || value < 0 || value > 1) throw new RangeError("Volume must be between 0 and 1");
    return value;
}

/** One playback instance. Multiple instances may play the same loaded sound. */
export class SoundPlayback {
    private _volume: number;
    constructor(private readonly audio: Audio, readonly id: number, volume: number) { this._volume = volume; }
    get state(): PlaybackState { return this.audio.playbackState(this.id); }
    get isPlaying(): boolean { return this.state === "playing"; }
    get volume(): number { return this._volume; }
    set volume(value: number) { this.audio.control(this.id, "volume", volumeValue(value)); this._volume = value; }
    pause(): void { this.audio.control(this.id, "pause"); }
    resume(): void { this.audio.control(this.id, "resume"); }
    stop(): void { this.audio.control(this.id, "stop"); }
}

/** SDL2 WAV playback with 32 simultaneous voices, independent of Canvas. */
export class Audio {
    private readonly _device: unknown;
    private _closed = false;
    private _volume = 1;
    private _paused = false;
    private readonly _durations = new Map<string, number>();
    constructor() { this._device = sdl2bind.audioOpen(); }
    private checkOpen(): void { if (this._closed) throw new Error("The audio device is closed"); }
    get closed(): boolean { return this._closed; }
    get paused(): boolean { return this._paused; }
    get volume(): number { return this._volume; }
    set volume(value: number) {
        this.checkOpen(); value = volumeValue(value);
        sdl2bind.audioGlobal(this._device, "volume", value); this._volume = value;
    }
    /** Load a WAV file or encoded WAV bytes. Returns its duration in seconds. */
    loadSound(id: string, source: string | Uint8Array): number {
        this.checkOpen();
        if (typeof id !== "string" || !id) throw new TypeError("A sound needs a nonempty ID");
        if (!(typeof source === "string" || source instanceof Uint8Array)) throw new TypeError("Sound source must be a filename or WAV bytes");
        const duration: number = sdl2bind.audioLoad(this._device, id, source);
        this._durations.set(id, duration); return duration;
    }
    getSoundDuration(id: string): number {
        this.checkOpen();
        if (!this._durations.has(id)) throw new Error(`Sound is not loaded: ${id}`);
        return this._durations.get(id)!;
    }
    play(id: string, options: SoundOptions = {}): SoundPlayback {
        this.checkOpen();
        const volume = volumeValue(options.volume ?? 1);
        if (options.loop !== undefined && typeof options.loop !== "boolean") throw new TypeError("Loop must be a boolean");
        return new SoundPlayback(this, sdl2bind.audioPlay(this._device, id, options.loop ?? false, volume), volume);
    }
    unloadSound(id: string): void {
        this.checkOpen(); sdl2bind.audioGlobal(this._device, "unload", id); this._durations.delete(id);
    }
    pause(): void { this.checkOpen(); sdl2bind.audioGlobal(this._device, "pause"); this._paused = true; }
    resume(): void { this.checkOpen(); sdl2bind.audioGlobal(this._device, "resume"); this._paused = false; }
    stopAll(): void { this.checkOpen(); sdl2bind.audioGlobal(this._device, "stop"); }
    close(): void {
        if (this._closed) return;
        sdl2bind.audioClose(this._device); this._closed = true; this._paused = false; this._durations.clear();
    }
    /** @internal */
    playbackState(id: number): PlaybackState {
        return this._closed ? "stopped" : sdl2bind.audioControl(this._device, id, "state");
    }
    /** @internal */
    control(id: number, action: "pause" | "resume" | "stop" | "volume", value = 0): void {
        this.checkOpen(); sdl2bind.audioControl(this._device, id, action, value);
    }
}
