import { Canvas } from "../index.js";
import * as path from "path";
const __dirname = path.resolve();
const canvas = new Canvas("My PNG", 280, 210);
canvas.loadPNG(path.join(__dirname, "/assets/png_test.png"));
canvas.sleep(1000);