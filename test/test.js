import { Canvas, Colors } from "../index.js";

const canvas = new Canvas("layers", 600, 400);

canvas.addLayer("layer1", 32, Colors.WHITE);
canvas.addLayer("layer2", 32, Colors.TRANSPARENT);

let frames = 0;

let black = Colors.BLACK;
black.alpha = 80;

canvas.loop(() => {
    canvas.clearAll();
    canvas.changeLayer("layer1");
    canvas.setBackgroundColor(Colors.WHITE);
    canvas.drawLine(Colors.RED, canvas.TOP_LEFT, canvas.BOTTOM_RIGHT);
    canvas.drawArc(Colors.INDIGO, canvas.CENTER, 30, 0, Math.PI * 2);
    canvas.changeLayer("layer2");
    canvas.setBackgroundColor(Colors.TRANSPARENT);
    canvas.drawLine(Colors.SALMON, canvas.CENTER_LEFT, canvas.BOTTOM_RIGHT);
    canvas.drawRectangle(black, canvas.TOP_LEFT, 30, 50, true);
    canvas.useMainLayer();
    if (frames > 2000)
        canvas.deactivateLayer("layer2");

    if (frames % 100 == 0)
        canvas.antialiasing = !canvas.antialiasing;
    frames++;
    console.log(canvas.fps);
    console.log(canvas.getLayers());
});