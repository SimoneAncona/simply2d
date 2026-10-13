import assert from "node:assert/strict";
import { toneWav } from "../examples/sounds.js";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
process.env.SDL_AUDIODRIVER = "dummy";
if (process.platform === "linux") process.env.SDL_VIDEODRIVER ??= "offscreen";
const { Audio, Canvas } = await import("../index.js");
const directory = mkdtempSync(join(tmpdir(), "simply2d-audio-"));
const audio = new Audio();
try {
    audio.pause();
    const wav = toneWav([440], 0.08);
    const filename = join(directory, "tone.wav");
    writeFileSync(filename, wav);
    assert.ok(Math.abs(audio.loadSound("tone", filename) - 0.08) < 0.001);
    audio.loadSound("other", new Uint8Array(wav));
    assert.throws(() => audio.loadSound("bad", Buffer.from("invalid")), /sound/);
    assert.throws(() => audio.play("missing"), /not loaded/);
    assert.throws(() => { audio.volume = 2; }, RangeError);
    const first = audio.play("tone", { loop: true, volume: 0.25 });
    const second = audio.play("tone");
    assert.notEqual(first.id, second.id);
    first.pause(); assert.equal(first.state, "paused");
    first.resume(); assert.equal(first.state, "paused");
    first.volume = 0.5; assert.equal(first.volume, 0.5);
    // The renderer's shutdown must leave the separate audio subsystem alive.
    const canvas = new Canvas("Audio lifecycle", 8, 8, 0, 0, { mode: "hidden", vsync: false });
    canvas.close();
    assert.equal(first.state, "paused");
    audio.resume();
    const deadline = Date.now() + 2000;
    while (second.state !== "stopped" && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 20));
    assert.equal(second.state, "stopped");
    assert.equal(first.state, "playing");
    first.stop(); assert.equal(first.state, "stopped");
    audio.pause();
    const voices = Array.from({ length: 32 }, () => audio.play("other", { loop: true }));
    assert.throws(() => audio.play("other"), /32 audio voices/);
    audio.unloadSound("other");
    assert.ok(voices.every(voice => voice.state === "stopped"));
    audio.play("tone", { loop: true }); audio.stopAll();
    audio.close(); audio.close();
    assert.equal(first.state, "stopped");
    assert.throws(() => audio.play("tone"), /closed/);
    const reopened = new Audio();
    try {
        assert.throws(() => new Audio(), /one Audio instance/);
        for (const extension of ["mp3", "ogg", "flac"]) {
            const path = fileURLToPath(new URL(`./assets/tone.${extension}`, import.meta.url));
            assert.ok(reopened.loadSound(extension, path) > 0);
            assert.ok(reopened.loadSound(`${extension}-bytes`, readFileSync(path)) > 0);
            reopened.play(extension);
            reopened.loadMusic(extension, path);
        }
        reopened.pause();
        const music = reopened.playMusic("ogg", { loop: true, volume: 0.2 });
        assert.equal(music.state, "paused");
        reopened.resume();
        assert.equal(music.state, "playing");
        music.pause(); assert.equal(music.state, "paused");
        music.resume(); music.volume = 0.4;
        const replacement = reopened.playMusic("mp3", { loop: true });
        assert.equal(music.state, "stopped");
        music.stop(); // A stale handle must not stop the replacement track.
        assert.equal(replacement.state, "playing");
        reopened.unloadMusic("mp3");
        assert.equal(replacement.state, "stopped");
        assert.throws(() => reopened.playMusic("missing"), /not loaded/);
        reopened.playMusic("flac", { loop: true }); reopened.stopAll();
    } finally { reopened.close(); }
} finally { audio.close(); rmSync(directory, { recursive: true, force: true }); }
console.log("Audio loading, playback, controls, and lifecycle passed.");
