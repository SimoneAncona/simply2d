import { Audio } from "../index.js";
import { fileURLToPath } from "node:url";
import { toneWav } from "./sounds.js";

if (process.argv.includes("--smoke")) process.env.SDL_AUDIODRIVER = "dummy";
const audio = new Audio();
try {
    audio.volume = 0.5;
    audio.loadSound("chime", toneWav([523, 659, 784, 1047], 0.15));
    audio.loadMusic("theme", fileURLToPath(new URL("./assets/platform-theme.ogg", import.meta.url)));
    const music = audio.playMusic("theme", { loop: true, volume: 0.2 });
    const playback = audio.play("chime");
    console.log("Playing a chime over streamed OGG music. No canvas is needed.");
    await new Promise(resolve => setTimeout(resolve, 200));
    playback.pause();
    await new Promise(resolve => setTimeout(resolve, 150));
    playback.resume();
    while (playback.state !== "stopped") await new Promise(resolve => setTimeout(resolve, 30));
    music.stop();
} finally { audio.close(); }
