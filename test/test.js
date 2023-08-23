import { Canvas, Colors } from "../index.js";

const canvas = new Canvas("circle", 200, 200);
console.log(Canvas.getScreenResolution());
canvas.drawArc(Colors.RED, canvas.CENTER, 10, 0, Math.PI * 2);
canvas.sleep(1000);