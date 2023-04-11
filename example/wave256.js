import { Canvas, Colors } from "../index.js"
const canvas = new Canvas("wave256", 255, 255);

for (let i = 0; i < canvas.getHeight(); i++) {
	for (let j = 0; j < canvas.getWidth(); j++) {
		canvas.drawPoint(Colors.from8bit(j), { x: j, y: i });
	}
}