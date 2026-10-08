import { Canvas, Colors, SpriteAnimation, SpriteSheet } from "../index.js";
import { fileURLToPath } from "node:url";

const smoke = process.argv.includes("--smoke");
if (smoke) {
    if (process.platform === "linux") process.env.SDL_VIDEODRIVER ??= "offscreen";
    process.env.SDL_AUDIODRIVER ??= "dummy";
}
const asset = name => fileURLToPath(new URL(`./assets/${name}`, import.meta.url));
const canvas = new Canvas("Sprite animation — Space: pause, R: reset", 400, 180, 0, 0, { scale: 2, resizable: true, antiAliasing: false, vsync: !smoke });
canvas.loadTexture("mario", asset("mario-sprites.png"));
canvas.loadTexture("tiles", asset("mario-tiles.png"));
canvas.loadFont("ui", asset("Roboto-Regular.ttf"));
const walk = new SpriteAnimation("mario", [16, 32, 48].map(x => ({ x, y: 88, width: 16, height: 16 })), { fps: 10 });
const spin = new SpriteSheet("tiles", 16, 16, 16, 14).animation([15, 31, 47, 31], { fps: 8 });
let elapsed = 0, paused = false, frames = 0;
const keys = new Set();
canvas.onKeyDown(key => {
    if (keys.has(key)) return;
    keys.add(key);
    if (key === "Space") { paused = !paused; paused ? walk.pause() : walk.play(); }
    if (key === "R") { walk.play(true); spin.play(true); elapsed = 0; paused = false; }
    if (key === "Escape") canvas.requestClose();
});
canvas.onKeyUp(key => keys.delete(key));
canvas.onWindowUnfocus(() => keys.clear());
canvas.loop(deltaMs => {
    if (!paused) { elapsed += deltaMs; walk.update(deltaMs); spin.update(deltaMs); }
    canvas.setBackgroundColor(Colors.from24bit(0x152238));
    canvas.drawText("SPRITE ANIMATION", "ui", 14, Colors.WHITE, { x: 18, y: 15 });
    canvas.drawText("Space: pause / resume   R: reset   Escape: close", "ui", 9, Colors.WHITE, { x: 18, y: 37 });
    canvas.drawRectangle(Colors.from24bit(0x334a63), { x: 0, y: canvas.height - 32 }, canvas.width, 32, true);
    const distance = Math.max(1, canvas.width - 72);
    const travel = elapsed / 1000 * 65 % (distance * 2);
    const flipX = travel > distance;
    const x = 20 + (flipX ? distance * 2 - travel : travel);
    canvas.drawAnimation(walk, { x, y: canvas.height - 64 }, { width: 32, height: 32, flipX });
    // Drawing the same animation twice does not advance its time twice.
    canvas.drawAnimation(walk, { x: canvas.width / 2 - 24, y: 65 }, { width: 48, height: 48,
        rotation: Math.sin(elapsed / 500) * 12, opacity: 0.65 });
    canvas.drawAnimation(spin, { x: canvas.width - 55, y: 70 }, { width: 24, height: 24 });
    if (smoke && ++frames === 4) canvas.requestClose();
}, { fps: 60 });
