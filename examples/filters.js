import { Canvas, PixelFormats, Colors } from "../index.js";
import * as path from "path";
const __dirname = path.resolve();
const canvas = new Canvas("My PNG", 250, 250);
canvas.loadPNG(path.join(__dirname, "/assets/png_test.png"));
canvas.sleep(1000);
let buf = new Uint8Array(canvas.width * canvas.height * 4);
canvas.drawLine(Colors.WHITE, canvas.TOP_LEFT, canvas.BOTTOM_RIGHT);
canvas.attach(buf, PixelFormats.rgba8888);