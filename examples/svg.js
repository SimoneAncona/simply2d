import { Canvas, Colors } from "../index.js";
import { fileURLToPath } from "node:url";
const smoke = process.argv.includes("--smoke");
if (smoke) {
    if (process.platform === "linux") process.env.SDL_VIDEODRIVER ??= "offscreen";
    process.env.SDL_AUDIODRIVER ??= "dummy";
}
const canvas = new Canvas("SVG textures — Escape to close", 480, 240, 0, 0, { vsync: !smoke });
const source = fileURLToPath(new URL("./assets/star.svg", import.meta.url));
canvas.loadSVG("small", source, { width: 48 });
canvas.loadSVG("large", source, { width: 144 });
canvas.onKeyDown(key => { if (key === "Escape") canvas.requestClose(); });
let elapsed = 0, frames = 0;
canvas.loop(deltaMs => {
    elapsed += deltaMs;
    canvas.setBackgroundColor(Colors.from24bit(0x152238));
    canvas.drawTexture("small", { x: 36, y: 96 });
    canvas.drawTexture("large", { x: 112, y: 48 }, { rotation: Math.sin(elapsed / 700) * 15, filtering: "linear" });
    canvas.drawTexture("large", { x: 300, y: 72 }, { width: 96, height: 96, opacity: 0.6, flipX: true });
    if (smoke && ++frames === 4) canvas.requestClose();
});
