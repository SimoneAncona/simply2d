import { Canvas } from "../index.js"
import * as path from "path";

const width = 255;
const height = 255;

const canvas = new Canvas("ciao", width, height);
while (true) {
    let buf = randomData();
    canvas.loadRawData(buf, 8);
}

function randomData() {
    let buff = new Uint8Array(width * height);
    for (let i = 0; i < buff.length; i++) buff[i] = Math.floor(Math.random() * 255);
    return buff;
}