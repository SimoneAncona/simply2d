import { Canvas, Colors } from "../index.js"

const canvas = new Canvas("lines", 500, 500, 0, 0, { antiAliasing: false });
const TOPL = { x: 0, y: 0 };
const TOPR = { x: canvas.width, y: 0 };
const BOTTOML = { x: 0, y: canvas.height };
const BOTTOMR = { x: canvas.width, y: canvas.height }
canvas.drawLine(Colors.BLUE, TOPL, BOTTOMR);
canvas.drawLine(Colors.RED, TOPR, BOTTOML);
canvas.sleep(1000);