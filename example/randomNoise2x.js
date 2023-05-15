import { Canvas } from "../index.js";
const width = 300;
const height = 300;
const canvas = new Canvas("Random noise", width, height, 0, 0, { scale: 2 });
while (true) {
    let buf = randomData();
    canvas.loadRawData(buf, 8);
}

function randomData() {
    let buff = new Uint8Array(width * height);
    for (let i = 0; i < buff.length; i++) buff[i] = Math.floor(Math.random() * 255);
    return buff;
}