import { Canvas } from "../index.js";
const width = 300;
const height = 300;
const canvas = new Canvas("Random noise", width, height);
while (true) {
    let buf = randomData();
    canvas.load8bitColor(buf);
}

function randomData() {
    let buff = new Uint8Array(width * height);
    for (let i = 0; i < buff.length; i++) buff[i] = Math.floor(Math.random() * 255);
    return buff;
}