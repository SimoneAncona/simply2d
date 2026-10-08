import { performance } from "node:perf_hooks";
if (process.platform === "linux") process.env.SDL_VIDEODRIVER ??= "offscreen";
process.env.SDL_AUDIODRIVER ??= "dummy";
const { Canvas, Colors, sdl2bind } = await import("../index.js");
const canvas = new Canvas("Drawing benchmark", 128, 128, 0, 0, { mode: "hidden", vsync: false, antiAliasing: false });
const present = sdl2bind.renderPresent;
let presentations = 0;
sdl2bind.renderPresent = (...args) => { presentations++; return present(...args); };
function draw() {
    for (let i = 0; i < 500; i++) canvas.drawRectangle(Colors.BLUE, { x: i % 120, y: i * 3 % 120 }, 8, 8, true);
}
try {
    const results = [];
    for (const mode of ["Immediate", "Batched"]) {
        presentations = 0;
        const start = performance.now();
        for (let frame = 0; frame < 5; frame++) {
            if (mode === "Batched") canvas.batch(draw);
            else draw();
        }
        results.push({ mode, "ms per frame": ((performance.now() - start) / 5).toFixed(2), "presents per frame": presentations / 5 });
    }
    console.table(results);
    console.log("500 rectangles per frame; timings depend on your renderer. VSync disabled.");
} finally {
    sdl2bind.renderPresent = present;
    canvas.close();
}
