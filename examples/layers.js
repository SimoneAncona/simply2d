import { Canvas, Colors } from "../index.js";

const canvas = new Canvas("layers", 600, 400);

canvas.addLayer("layer2", 32);
canvas.addLayer("layer1", 32);

let frames = 0;

canvas.loop(() => {
    canvas.changeLayer("layer2");
    canvas.drawLine(Colors.RED, canvas.TOP_LEFT, canvas.BOTTOM_RIGHT);
    canvas.drawArc(Colors.INDIGO, canvas.CENTER, 30, 0, Math.PI * 2);
    canvas.changeLayer("layer2");
    canvas.drawRectangle(Colors.DARK_BLUE, canvas.TOP_LEFT, 30, 50, true);
    if (frames % 20 == 0)
        canvas.clear();
    frames++;
    console.log(canvas.fps);
});