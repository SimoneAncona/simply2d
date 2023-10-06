import { Canvas, Colors } from "../index.js";

const width = 600;
const height = 400;
const canvas = new Canvas("layers", width, height);

canvas.addLayer("layer1", 32);
// canvas.addLayer("layer2", 32);

canvas.changeLayer("layer1");
canvas.drawArc(Colors.RED, canvas.CENTER, 10, 0, Math.PI * 2);
canvas.sleep(1000);