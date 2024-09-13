import { Canvas, Colors } from "../index.js";

const canvas = new Canvas("layers", 600, 400);

canvas.addLayer("layer1", 32, Colors.WHITE);
canvas.addLayer("layer2", 32, Colors.TRANSPARENT);

let frames = 1;

canvas.loop(() => {
    canvas.clear();
    canvas.changeLayer("layer1");
    canvas.drawLine(Colors.RED, canvas.TOP_LEFT, canvas.BOTTOM_RIGHT);
    canvas.drawArc(Colors.INDIGO, canvas.CENTER, 30, 0, Math.PI * 2);
    canvas.changeLayer("layer2");
    //canvas.setBackgroundColor(Colors.TRANSPARENT);
    canvas.drawLine(Colors.SALMON, canvas.CENTER_LEFT, canvas.BOTTOM_RIGHT);
    canvas.drawRectangle(Colors.DARK_BLUE, canvas.TOP_LEFT, 30, 50, true);
    canvas.drawRectangle(Colors.DARK_BLUE, canvas.CENTER, 30, 50, true);
    
    if (frames > 2000)
        canvas.deactivateLayer("layer2");

    if (frames % 30 == 0)
        canvas.moveLayer("layer1", "up")

    frames++;
    console.log(canvas.fps);
    console.log(canvas.getLayers());
});