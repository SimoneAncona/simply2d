import { Canvas, Colors } from "../index.js"

const canvas = new Canvas("Hello World", 300, 300);
canvas.loadFont("roboto", "assets/Roboto-Regular.ttf");

canvas.drawText("Hello World", "roboto", 40, Colors.WHITE, { x: 0, y: 0 });
canvas.sleep(1000)