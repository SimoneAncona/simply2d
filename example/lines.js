import { Canvas, Colors } from "../index.js"

const canvas = new Canvas("lines", 500, 500);
const TOPL = { x: 0, y: 0 };
const TOPR = { x: canvas.getWidth(), y: 0 };
const BOTTOML = { x: 0, y: canvas.getHeight() };
const BOTTOMR = { x: canvas.getWidth(), y: canvas.getHeight() }
canvas.drawLine(Colors.BLUE, TOPL, BOTTOMR);
canvas.drawLine(Colors.RED, TOPR, BOTTOML);
canvas.sleep(1000);