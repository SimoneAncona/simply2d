import { Canvas, Colors } from "../index.js";

const canvas = new Canvas("circle", 600, 600);
canvas.setBackgroundColor(Colors.WHITE);
canvas.drawArc(Colors.BLUE, canvas.CENTER, 200, 0, Math.PI);
canvas.drawArc(Colors.BLUE, canvas.CENTER, 200, Math.PI, Math.PI * 2);
canvas.sleep(1000);