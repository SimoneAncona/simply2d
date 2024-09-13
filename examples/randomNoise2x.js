import { Canvas } from "../index.js";
const width = 300;
const height = 300;
const canvas = new Canvas("Random noise", width, height, 0, 0, { scale: 2 });
let buf = new Uint8Array(width * height);
canvas.loop(() => {
    randomData();
    canvas.loadRawData(buf, 8);
})

function randomData() {
    for (let i = 0; i < buf.length; i++) buf[i] = Math.floor(Math.random() * 255);
    return buf;
}