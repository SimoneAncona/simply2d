import { Audio, Canvas, Colors, SpriteAnimation, SpriteSheet } from "../index.js";
import { fileURLToPath } from "node:url";
import { loadGameSounds } from "./sounds.js";
import { MarioWorld, TILE, WORLD_WIDTH, FLOOR, FLAG_X, platforms } from "./mario-world.js";

// Arrows/A/D: move. Space/Up/W: jump. Shift: run. P: pause. R: restart. M: mute. Escape: close.
const smoke = process.argv.includes("--smoke");
if (smoke) {
    if (process.platform === "linux") process.env.SDL_VIDEODRIVER ??= "offscreen";
    process.env.SDL_AUDIODRIVER ??= "dummy";
}
const asset = name => fileURLToPath(new URL(`./assets/${name}`, import.meta.url));
const canvas = new Canvas("Simply2D — Mario platformer", 320, 180, 0, 0, { scale: 3, resizable: true, antiAliasing: false, vsync: !smoke });
canvas.loadTexture("characters", asset("mario-sprites.png"));
canvas.loadTexture("tiles", asset("mario-tiles.png"));
canvas.loadFont("ui", asset("Roboto-Regular.ttf"));
let audio;
let muted = false;
if (!process.argv.includes("--no-audio")) {
    try { audio = new Audio(); loadGameSounds(audio); audio.volume = 0.4; }
    catch (error) { audio?.close(); audio = undefined; console.warn(`Audio unavailable: ${error.message}`); }
}
canvas.onWindowClose(() => audio?.close());
const sound = id => audio?.play(id);
const tiles = new SpriteSheet("tiles", TILE, TILE, 16, 14);
const marioFrame = x => ({ x, y: 88, width: 16, height: 16 });
const walk = new SpriteAnimation("characters", [16, 32, 48].map(marioFrame), { fps: 12 });
const coinAnimation = tiles.animation([15, 31, 47, 31], { fps: 8 });
const game = new MarioWorld();
const keys = new Set();
const sky = Colors.from24bit(0x5c94fc);
let paused = false, camera = 0, frames = 0, screenshotTaken = false;
const jumpKeys = new Set(["Space", "Up", "W"]);
canvas.onKeyDown(key => {
    if (keys.has(key)) return;
    keys.add(key);
    if (jumpKeys.has(key) && !paused) game.jump();
    if (key === "P") paused = !paused;
    if (key === "M") { muted = !muted; if (audio) audio.volume = muted ? 0 : 0.4; }
    if (key === "R") { audio?.stopAll(); game.restart(); camera = 0; walk.play(true); paused = false; }
    if (key === "Escape") canvas.requestClose();
});
canvas.onKeyUp(key => { keys.delete(key); if (jumpKeys.has(key)) game.releaseJump(); });
canvas.onWindowUnfocus(() => { if (!smoke) paused = true; keys.clear(); });
canvas.onWindowMinimize(() => { paused = true; keys.clear(); });
canvas.onWindowResize((width, height) => console.log(`Canvas resized to ${width} × ${height} logical pixels`));

function tile(index, x, y) {
    if (x < -TILE || x > canvas.width) return;
    canvas.drawTexture("tiles", { x: Math.round(x), y: Math.round(y) }, { source: tiles.frame(index) });
}
function text(message, x, y, size = 9, color = Colors.WHITE) {
    canvas.drawText(message, "ui", size, color, { x, y });
}
function draw() {
    canvas.setBackgroundColor(sky);
    const offsetY = canvas.height - 180;
    // Clouds move more slowly than the foreground: a simple parallax camera.
    for (let i = 0; i < 9; i++) {
        const x = i * 170 + 24 - camera * 0.35;
        if (x > -48 && x < canvas.width) canvas.drawTexture("tiles", { x, y: 36 + i % 2 * 18 + offsetY },
            { source: { x: 176, y: 160, width: 48, height: 32 } });
    }
    for (const platform of platforms) {
        // Draw only visible tiles, rather than the entire level.
        const first = Math.max(0, Math.floor((camera - platform.x) / TILE));
        const last = Math.min(platform.width / TILE, Math.ceil((camera + canvas.width - platform.x) / TILE));
        for (let column = first; column < last; column++) for (let row = 0; row < platform.height / TILE; row++) {
            tile(platform.tile, platform.x + column * TILE - camera, platform.y + row * TILE + offsetY);
        }
    }
    for (const coin of game.coins) if (!coin.collected && coin.x > camera - TILE && coin.x < camera + canvas.width + TILE) {
        canvas.drawAnimation(coinAnimation, { x: Math.round(coin.x - 8 - camera), y: Math.round(coin.y - 8 + Math.sin(game.elapsed * 5 + coin.x) * 2 + offsetY) });
    }
    for (const x of [320, 736, 1088]) if (x - camera >= 0 && x - camera < canvas.width) {
        canvas.drawRectangle(Colors.WHITE, { x: x - camera, y: FLOOR - 24 + offsetY }, 2, 24, true);
        canvas.drawRectangle(Colors.from24bit(0x39b54a), { x: x - camera + 2, y: FLOOR - 24 + offsetY }, 9, 7, true);
    }
    const flagX = Math.round(FLAG_X - camera);
    if (flagX > -24 && flagX < canvas.width) {
        canvas.drawRectangle(Colors.WHITE, { x: flagX, y: 48 + offsetY }, 2, FLOOR - 48, true);
        canvas.drawRectangle(Colors.from24bit(0xffd700), { x: flagX + 2, y: (game.won ? FLOOR - 16 : 50) + offsetY }, 20, 12, true);
    }
    const player = game.player;
    const position = { x: Math.round(player.x - 2 - camera), y: Math.round(player.y + offsetY) };
    if (player.grounded && Math.abs(player.vx) > 5 && !game.won) canvas.drawAnimation(walk, position, { flipX: player.facingLeft });
    else canvas.drawTexture("characters", position, { source: marioFrame(player.grounded ? 0 : 80), flipX: player.facingLeft });
    // HUD stays in screen coordinates while the level scrolls.
    canvas.drawRectangle({ red: 15, green: 30, blue: 55, alpha: 210 }, { x: 0, y: 0 }, canvas.width, 24, true);
    const collected = game.coins.filter(coin => coin.collected).length;
    text(`MARIO   ${String(game.score).padStart(5, "0")}    COINS ${collected}/${game.coins.length}    FALLS ${game.deaths}`, 7, 3, 8);
    text(`MOVE: ARROWS/A D   JUMP: SPACE   RUN: SHIFT   P: PAUSE   R: RESET   M: ${muted ? "UNMUTE" : "MUTE"}`, 7, 15, 5);
    if (paused || game.won) {
        canvas.drawRectangle({ red: 10, green: 20, blue: 40, alpha: 200 }, { x: 0, y: 24 }, canvas.width, canvas.height - 24, true);
        text(game.won ? "LEVEL COMPLETE!" : "PAUSED", Math.max(10, canvas.width / 2 - 48), canvas.height / 2 - 10, 13);
        text(game.won ? "Press R to play again" : "Press P to continue", Math.max(10, canvas.width / 2 - 42), canvas.height / 2 + 10, 8);
    }
}

const screenshot = process.argv.find(argument => argument.startsWith("--screenshot="));
canvas.loop(deltaMs => {
    if (audio && paused !== audio.paused) paused ? audio.pause() : audio.resume();
    if (!paused && !game.won) {
        const before = { vy: game.player.vy, score: game.score, deaths: game.deaths, won: game.won };
        game.update(deltaMs / 1000, { left: keys.has("Left") || keys.has("A"), right: keys.has("Right") || keys.has("D"),
            run: keys.has("Left Shift") || keys.has("Right Shift") });
        if (game.deaths > before.deaths) sound("fall");
        else if (game.player.vy < 0 && before.vy >= 0) sound("jump");
        if (game.won && !before.won) sound("win");
        else if (game.score > before.score) sound("coin");
        walk.update(deltaMs);
        coinAnimation.update(deltaMs);
    }
    camera = Math.max(0, Math.min(Math.max(0, WORLD_WIDTH - canvas.width), game.player.x - canvas.width * 0.35));
    draw();
    if (screenshot && !screenshotTaken) { canvas.dumpPNG(screenshot.slice("--screenshot=".length)); screenshotTaken = true; }
    if (smoke && ++frames === 4) canvas.requestClose();
}, { fps: 60, maxDeltaMs: 100 });
