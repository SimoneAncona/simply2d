import { Canvas, PixelFormats } from "../index.js";
const width = 300;
const height = 300;
const canvas = new Canvas("Random noise", width, height);
let buf = new Uint8Array(width * height);
canvas.attach(buf, PixelFormats.rgb332);

setInterval(() => {
    for (let i = 0; i < buf.length; i++) buf[i] = Math.floor(Math.random() * 255);
    return buf;
});