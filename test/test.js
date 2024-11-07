import { Canvas, PixelFormats } from "../index.js";
import * as path from "path";
const __dirname = path.resolve();
const canvas = new Canvas("My PNG", 500, 500);
canvas.loadPNG(path.join(__dirname, "/examples/assets/png_test.png"));
canvas.sleep(1000);
let buf = new Uint8Array(canvas.width * canvas.height * 4);
canvas.attach(buf, PixelFormats.rgba8888);