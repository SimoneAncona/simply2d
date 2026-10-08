import { Canvas, Colors } from "../index.js";

const canvas = new Canvas("Framebuffer filter", 250, 250);
canvas.setBackgroundColor(Colors.RED);
canvas.drawLine(Colors.WHITE, canvas.TOP_LEFT, canvas.BOTTOM_RIGHT);
canvas.applyFilter((value, i) => {
    if (i % 4 == 1) return 255
    return value
});
canvas.sleep(1000);
canvas.close();
