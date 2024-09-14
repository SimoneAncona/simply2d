import { Canvas, Colors } from "../index.js"

const canvas = new Canvas("lines", 500, 500, 0, 0, { antiAliasing: false });
canvas.drawLine(Colors.BLUE, canvas.TOP_LEFT, canvas.BOTTOM_RIGHT);
canvas.drawLine(Colors.RED, canvas.TOP_RIGHT, canvas.BOTTOM_LEFT);
canvas.sleep(1000);