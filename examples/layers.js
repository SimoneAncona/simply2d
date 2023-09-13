import { Canvas, Colors } from "../index.js";

const canvas = new Canvas("layers", 600, 400);

canvas.addLayer("layer1", 32)
canvas.addLayer("layer2", 32)

canvas.loop(() => {
    canvas.setCurrentLayer("layer1");
    canvas.drawArc(Colors.INDIGO, canvas.CENTER, 30, 0, Math.PI * 2);
});