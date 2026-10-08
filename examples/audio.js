import { Audio } from "../index.js";
import { toneWav } from "./sounds.js";

if (process.argv.includes("--smoke")) process.env.SDL_AUDIODRIVER = "dummy";
const audio = new Audio();
try {
    audio.volume = 0.5;
    audio.loadSound("chime", toneWav([523, 659, 784, 1047], 0.15));
    const playback = audio.play("chime");
    console.log("Playing a synthesized WAV chime. No canvas is needed.");
    await new Promise(resolve => setTimeout(resolve, 200));
    playback.pause();
    await new Promise(resolve => setTimeout(resolve, 150));
    playback.resume();
    while (playback.state !== "stopped") await new Promise(resolve => setTimeout(resolve, 30));
} finally { audio.close(); }
