import { Canvas, Colors } from "../index.js"

const canvas = new Canvas("click here", 500, 500);

let clicks = [];

canvas.onClick((x, y) => {
    clicks.push({ x: x, y: y });
});

canvas.loop(() => {
    for (let pos of clicks) {
        canvas.drawRectangle(Colors.RED, pos, 10, 10);
    }
});