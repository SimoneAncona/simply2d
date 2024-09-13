import { Canvas, Colors } from "../index.js"
const canvas = new Canvas("wave256", 255, 255);

canvas.loop(() => {
	for (let i = 0; i < canvas.height; i++) {
		for (let j = 0; j < canvas.width; j++) {
			canvas.drawPoint(Colors.from8bit(j), { x: j, y: i });
		}
	}
})