import { Canvas } from "../../index.js";
import { Colors } from "../../index.js";

const canvas = new Canvas("first test", 600, 400);
canvas.setBackgroundColor({
	red: 20,
	green: 50,
	blue: 255,
	alpha: 255
});
canvas.drawLine(Colors.from8bit(49), { x: 0, y: 0 }, { x: canvas.getWidth(), y: canvas.getHeight() });
canvas.sleep(1000);