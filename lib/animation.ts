import { AnimationOptions, Rectangle } from "./types.js";

/** An independently timed animation; update once per game frame, draw as needed. */
export class SpriteAnimation {
	readonly frames: readonly Readonly<Rectangle>[];
	readonly fps: number;
	readonly loop: boolean;
	private _index = 0;
	private _elapsed = 0;
	private _playing: boolean;
	private _finished = false;

	constructor(readonly textureID: string, frames: readonly Rectangle[], options: AnimationOptions = {}) {
		this.fps = options.fps ?? 12;
		this.loop = options.loop ?? true;
		this._playing = options.autoplay ?? true;
		if (!textureID || frames.length === 0) throw new Error("An animation needs a texture ID and at least one frame");
		if (!Number.isFinite(this.fps) || this.fps <= 0) throw new RangeError("Animation fps must be positive and finite");
		this.frames = Object.freeze(frames.map(frame => {
			if (![frame.x, frame.y, frame.width, frame.height].every(Number.isSafeInteger)
				|| frame.x < 0 || frame.y < 0 || frame.width <= 0 || frame.height <= 0) {
				throw new RangeError("Animation frames must be positive rectangles at nonnegative integer coordinates");
			}
			return Object.freeze({ ...frame });
		}));
	}

	get frame(): Readonly<Rectangle> { return this.frames[this._index]; }
	get frameIndex(): number { return this._index; }
	get isPlaying(): boolean { return this._playing; }
	get finished(): boolean { return this._finished; }

	/** Advance using milliseconds from Canvas.loop. Long frames skip ahead without iterating. */
	update(deltaMs: number): void {
		if (!Number.isFinite(deltaMs) || deltaMs < 0) throw new RangeError("Animation delta must be nonnegative and finite");
		if (!this._playing) return;
		const duration = 1000 / this.fps;
		// Reduce large loop deltas before adding, keeping time and frame indexes bounded.
		this._elapsed += this.loop ? deltaMs % (duration * this.frames.length) : Math.min(deltaMs, duration * this.frames.length);
		const steps = Math.floor(this._elapsed / duration);
		this._elapsed %= duration;
		const index = this._index + steps;
		if (this.loop) this._index = index % this.frames.length;
		else if (index >= this.frames.length) {
			this._index = this.frames.length - 1;
			this._playing = false;
			this._finished = true;
		} else this._index = index;
	}

	play(restart = false): void {
		if (restart || this._finished) this.reset();
		this._playing = true;
	}
	pause(): void { this._playing = false; }
	stop(): void { this.pause(); this.reset(); }
	reset(): void { this._index = 0; this._elapsed = 0; this._finished = false; }
}

/** A regular sprite-sheet grid; frame indexes run from left to right, then down. */
export class SpriteSheet {
	constructor(
		readonly textureID: string,
		readonly frameWidth: number,
		readonly frameHeight: number,
		readonly columns: number,
		readonly rows: number
	) {
		if (!textureID || ![frameWidth, frameHeight, columns, rows].every(value => Number.isSafeInteger(value) && value > 0)
			|| !Number.isSafeInteger(columns * rows) || !Number.isSafeInteger(frameWidth * columns) || !Number.isSafeInteger(frameHeight * rows)) {
			throw new RangeError("A sprite sheet needs a texture ID and positive integer grid dimensions");
		}
	}

	frame(index: number): Rectangle {
		if (!Number.isSafeInteger(index) || index < 0 || index >= this.columns * this.rows) throw new RangeError("Sprite-sheet frame index is out of range");
		return { x: index % this.columns * this.frameWidth, y: Math.floor(index / this.columns) * this.frameHeight,
			width: this.frameWidth, height: this.frameHeight };
	}

	animation(indexes: readonly number[], options: AnimationOptions = {}): SpriteAnimation {
		return new SpriteAnimation(this.textureID, indexes.map(index => this.frame(index)), options);
	}
}
