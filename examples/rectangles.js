import { Canvas, Colors } from "../index.js";
const width = 900;
const height = 800;
const canvas = new Canvas("rectangles", width, height);
canvas.drawRectangle(Colors.WHITE, { x: width / 2, y: height / 2 }, 20, 30);
canvas.drawRectangle(Colors.MAGENTA, { x: 40, y: 80 }, 30, 50, true);
canvas.sleep(1000);