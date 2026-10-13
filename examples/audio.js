import { Audio, Canvas, Colors } from "../index.js";
import { fileURLToPath } from "node:url";
import { loadGameSounds } from "./sounds.js";

const smoke = process.argv.includes("--smoke");
if (smoke) {
    if (process.platform === "linux") process.env.SDL_VIDEODRIVER ??= "offscreen";
    process.env.SDL_AUDIODRIVER = "dummy";
}
const asset = name => fileURLToPath(new URL(`./assets/${name}`, import.meta.url));
const audio = new Audio();
let canvas;
try {
    // Effects are decoded into memory. Every play() has its own controls.
    loadGameSounds(audio);
    audio.loadSound("melody", asset("platform-theme.ogg"));
    // Music is streamed from a file and plays alongside the effect channels.
    audio.loadMusic("theme", asset("platform-theme.ogg"));
    audio.volume = 0.5;
    let music = audio.playMusic("theme", { loop: true, volume: 0.3 });
    let loopedEffect, effects = [], volume = 0.5, muted = false, lastAction = "Music started", frames = 0;
    const playEffect = (id, options) => {
        try { return audio.play(id, options); }
        catch (error) { lastAction = error.message; return undefined; }
    };
    const keys = new Set();
    const effectKeys = { "1": "jump", "2": "coin", "3": "fall", "4": "win", "5": "melody" };
    const masterVolume = () => { audio.volume = muted ? 0 : volume; };
    const restartMusic = () => { music = audio.playMusic("theme", { loop: true, volume: 0.3 }); };

    canvas = new Canvas("Audio controls", 560, 360, 0, 0, { vsync: !smoke });
    canvas.loadFont("ui", asset("Roboto-Regular.ttf"));
    canvas.onWindowClose(() => audio.close());
    canvas.onWindowUnfocus(() => keys.clear());
    canvas.onKeyUp(key => keys.delete(key));
    canvas.onKeyDown(key => {
        if (keys.has(key)) return;
        keys.add(key);
        if (effectKeys[key]) {
            const id = effectKeys[key];
            const effect = playEffect(id, { volume: 0.7 });
            if (effect) { effects.push(effect); lastAction = `Playing ${id}`; }
        } else if (key === "Space") {
            if (music.state === "stopped") restartMusic();
            else if (music.state === "paused") music.resume();
            else music.pause();
            lastAction = "Music playback toggled";
        } else if (key === "P") {
            audio.paused ? audio.resume() : audio.pause();
            lastAction = audio.paused ? "All audio paused" : "All audio resumed";
        } else if (key === "M") {
            muted = !muted;
            masterVolume();
            lastAction = muted ? "Muted (playback continues)" : "Unmuted";
        } else if (key === "Up" || key === "Down") {
            volume = Math.max(0, Math.min(1, Math.round((volume + (key === "Up" ? 0.1 : -0.1)) * 10) / 10));
            masterVolume();
            lastAction = `Master volume ${Math.round(volume * 100)}%`;
        } else if (key === "L") {
            if (loopedEffect && loopedEffect.state !== "stopped") loopedEffect.stop();
            else loopedEffect = playEffect("coin", { loop: true, volume: 0.2 });
            if (loopedEffect) lastAction = "Looped effect toggled";
        } else if (key === "O") {
            if (loopedEffect?.state === "playing") loopedEffect.pause();
            else if (loopedEffect?.state === "paused") loopedEffect.resume();
            lastAction = "Looped effect pause toggled";
        } else if (key === "R") {
            restartMusic();
            lastAction = "Music restarted";
        } else if (key === "S") {
            audio.stopAll();
            lastAction = "All playback stopped";
        } else if (key === "Escape") canvas.requestClose();
    });

    const text = (message, x, y, size = 13, color = Colors.WHITE) => canvas.drawText(message, "ui", size, color, { x, y });
    canvas.loop(() => {
        effects = effects.filter(effect => effect.state !== "stopped");
        canvas.setBackgroundColor(Colors.from24bit(0x152238));
        text("SDL_MIXER AUDIO", 20, 16, 20);
        text("32 sound channels + one streamed music track", 20, 45, 12);
        text(`Music: ${music.state}   All paused: ${audio.paused ? "yes" : "no"}   Mute: ${muted ? "on" : "off"}`, 20, 78);
        text(`Effects: ${effects.length}   Looped effect: ${loopedEffect?.state ?? "stopped"}`, 20, 101);
        text(`Master volume: ${Math.round(volume * 100)}%`, 20, 128);
        canvas.drawRectangle(Colors.from24bit(0x334a63), { x: 20, y: 153 }, 520, 10, true);
        if (!muted && volume > 0) canvas.drawRectangle(Colors.from24bit(0x59c9a5), { x: 20, y: 153 }, 520 * volume, 10, true);
        text("1: jump   2: coin   3: fall   4: win   5: OGG melody effect", 20, 185, 12);
        text("Space: pause/resume music   R: restart music", 20, 208, 12);
        text("L: start/stop looped effect   O: pause/resume effect", 20, 231, 12);
        text("P: pause/resume all   M: mute   Up/Down: master volume", 20, 254, 12);
        text("S: stop all   Escape: close", 20, 277, 12);
        text(lastAction, 20, 316, 12, Colors.from24bit(0xffd166));
        if (smoke && ++frames === 4) {
            // Exercise independent playback and master controls without keyboard input.
            const effect = audio.play("jump");
            effect.pause(); effect.resume(); effect.volume = 0.4;
            music.pause(); music.resume();
            audio.pause(); audio.resume();
            canvas.requestClose();
        }
    }, { fps: 60 });
} catch (error) {
    audio.close();
    canvas?.close();
    throw error;
}
