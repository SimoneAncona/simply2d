import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (process.platform === "linux") process.env.SDL_VIDEODRIVER ??= "offscreen";
process.env.SDL_AUDIODRIVER ??= "dummy";
const { Canvas, Colors, SpriteSheet, sdl2bind } = await import("../index.js");
const directory = fs.mkdtempSync(path.join(os.tmpdir(), "simply2d-game-"));
const canvas = new Canvas("Game smoke test", 8, 4, 0, 0, { mode: "hidden", resizable: true, antiAliasing: false, vsync: false });
const present = sdl2bind.renderPresent;
let presentations = 0;
sdl2bind.renderPresent = (...args) => { presentations++; return present(...args); };
const pixels = () => new Uint32Array(canvas.getRawData().buffer);
try {
    canvas.batch(() => {
        canvas.setBackgroundColor(Colors.RED);
        canvas.batch(() => canvas.drawRectangle(Colors.GREEN, { x: 4, y: 0 }, 4, 4, true));
    });
    assert.equal(presentations, 1);
    assert.throws(() => canvas.batch(() => { throw new Error("batch failed"); }), /batch failed/);
    canvas.dumpPNG(path.join(directory, "sheet.png"));
    canvas.loadTexture("sheet", path.join(directory, "sheet.png"));
    assert.deepEqual(canvas.getTextureResolution("sheet"), { w: 8, h: 4 });
    canvas.drawTexture("sheet", { x: 0, y: 0 }, { flipX: true });
    assert.equal(pixels()[0], 0x00ff00ff);
    assert.equal(pixels()[7], 0xff0000ff);
    const animation = new SpriteSheet("sheet", 4, 4, 2, 1).animation([0, 1], { fps: 10 });
    animation.update(100);
    canvas.drawAnimation(animation, { x: 0, y: 0 });
    assert.equal(pixels()[0], 0x00ff00ff);
    assert.throws(() => canvas.drawTexture("sheet", { x: 0, y: 0 }, { opacity: 2 }), RangeError);
    canvas.drawTexture("sheet", { x: 0, y: 0 }, { filtering: "linear" });
    assert.throws(() => canvas.drawTexture("sheet", { x: 0, y: 0 }, { filtering: "invalid" }), RangeError);
    canvas.loadFont("ui", fileURLToPath(new URL("../examples/assets/Roboto-Regular.ttf", import.meta.url)));
    canvas.drawText("HUD", "ui", 10, Colors.WHITE, { x: 0, y: 0 });
    canvas.drawText("HUD", "ui", 12, Colors.WHITE, { x: 0, y: 0 });
    canvas.drawText("HUD", "ui", 10, Colors.WHITE, { x: 0, y: 0 });
    canvas.unloadTexture("sheet");
    assert.throws(() => canvas.drawTexture("sheet", { x: 0, y: 0 }), /not loaded/);

    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="4"><rect width="4" height="4" fill="#ff0000"/></svg>');
    const svgFile = path.join(directory, "test.svg");
    fs.writeFileSync(svgFile, svg);
    canvas.loadSVG("vector", svgFile);
    assert.deepEqual(canvas.getTextureResolution("vector"), { w: 8, h: 4 });
    canvas.batch(() => { canvas.setBackgroundColor(Colors.BLUE); canvas.drawTexture("vector", { x: 0, y: 0 }); });
    assert.equal(pixels()[0], 0xff0000ff);
    assert.equal(pixels()[7], 0x0000ffff);
    canvas.loadSVG("vector", svg, { width: 16 });
    assert.deepEqual(canvas.getTextureResolution("vector"), { w: 16, h: 8 });
    assert.throws(() => canvas.loadSVG("vector", svg, { width: -1 }), RangeError);
    assert.throws(() => canvas.loadSVG("vector", Buffer.from("invalid")), /SVG/);
    assert.deepEqual(canvas.getTextureResolution("vector"), { w: 16, h: 8 });
    canvas.unloadTexture("vector");

    // Real SDL events cover resize, show/hide, unsubscribe, and close cancellation.
    canvas.pollEvents();
    let resized;
    canvas.onWindowResize((width, height) => { resized = [width, height]; });
    canvas.resize(12, 6);
    canvas.pollEvents();
    assert.deepEqual(resized, [12, 6]);
    assert.equal(canvas.width, 12);
    assert.deepEqual({ x: canvas.BOTTOM_RIGHT.x, y: canvas.BOTTOM_RIGHT.y }, { x: 12, y: 6 });
    assert.equal(pixels().length, 72);
    let shown = 0, hidden = 0;
    const unsubscribe = canvas.onWindowShow(() => shown++);
    canvas.onWindowHide(() => hidden++);
    canvas.show(); canvas.pollEvents();
    canvas.hide(); canvas.pollEvents();
    assert.equal(shown, 1);
    assert.equal(hidden, 1);
    unsubscribe();
    canvas.show(); canvas.pollEvents();
    assert.equal(shown, 1);
    const cancel = canvas.onWindowClose(() => false);
    canvas.requestClose(); canvas.pollEvents();
    canvas.batch(() => canvas.setBackgroundColor(Colors.BLUE));

    presentations = 0;
    await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => { canvas.endLoop(); reject(new Error("Loop did not stop")); }, 2000);
        let frames = 0;
        canvas.loop(deltaMs => {
            assert.ok(deltaMs > 0 && deltaMs <= 50);
            canvas.drawPoint(Colors.WHITE, { x: 0, y: 0 });
            if (++frames === 3) { canvas.endLoop(); clearTimeout(timeout); resolve(); }
        }, { fps: 60, maxDeltaMs: 50 });
    });
    assert.equal(presentations, 3);
    // Stopping the loop must leave immediate drawing enabled.
    canvas.drawPoint(Colors.RED, { x: 0, y: 0 });
    assert.equal(presentations, 4);
    cancel();
    canvas.requestClose(); canvas.pollEvents();
    assert.throws(() => canvas.batch(() => {}), /closed/);
} finally {
    sdl2bind.renderPresent = present;
    canvas.close();
    fs.rmSync(directory, { recursive: true, force: true });
}
console.log("Sprites, batching, loop, and window events passed.");
