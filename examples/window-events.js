import { Canvas, Colors } from "../index.js";

const canvas = new Canvas("Window events", 500, 300, 0, 0, { resizable: true });
let focused = true;
canvas.onWindowResize((width, height) => console.log("resize", width, height));
canvas.onWindowMove((x, y) => console.log("move", x, y));
canvas.onWindowFocus(() => { focused = true; console.log("focus"); });
canvas.onWindowUnfocus(() => { focused = false; console.log("unfocus"); });
canvas.onWindowMinimize(() => console.log("minimize"));
canvas.onWindowMaximize(() => console.log("maximize"));
canvas.onWindowRestore(() => console.log("restore"));
canvas.onWindowShow(() => console.log("show"));
canvas.onWindowHide(() => console.log("hide"));
canvas.onWindowMouseEnter(() => console.log("mouse enter"));
canvas.onWindowMouseLeave(() => console.log("mouse leave"));
canvas.onWindowClose(() => console.log("close request")); // Return false here to keep it open.
canvas.loop(() => {
    canvas.setBackgroundColor(focused ? Colors.DARK_BLUE : Colors.GRAY);
    canvas.drawRectangle(Colors.WHITE, { x: canvas.width / 2 - 25, y: canvas.height / 2 - 25 }, 50, 50, true);
});
