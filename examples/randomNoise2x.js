import { Canvas, PixelFormats } from "../index.js";
const width = 300;
const height = 300;
const canvas = new Canvas("Random noise", width, height, null, null, { scale: 2 });
let buf = new Uint8Array(width * height);

canvas.loop(() => {
    for (let i = 0; i < buf.length; i++) buf[i] = Math.floor(Math.random() * 255);
    canvas.loadRawData(buf, PixelFormats.rgb332);
})