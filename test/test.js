import { Canvas, Colors } from "../index.js";

const canvas = new Canvas("circle", 200, 200);
canvas.drawArc(10, 0, Math.PI * 2, Colors.RED, canvas.CENTER);
canvas.sleep(1000);