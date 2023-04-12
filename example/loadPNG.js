import { Canvas } from "../index.js";
const canvas = new Canvas("My PNG", 280, 210);
canvas.loadPNG("./assets/png_test.png");
canvas.sleep(1000);