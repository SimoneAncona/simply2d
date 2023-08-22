import { Canvas, Colors } from "../index.js";

const canvas = new Canvas("circle", 600, 600);
canvas.drawArc(200, 0, Math.PI, Colors.BLUE, canvas.CENTER);
canvas.drawArc(200, Math.PI, Math.PI * 2, Colors.RED, canvas.CENTER);
canvas.sleep(1000);