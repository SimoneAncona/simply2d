import { Canvas, Colors } from "../index.js"
import * as path from "path";

const width = 255;
const height = 255;

const canvas = new Canvas("ciao", width, height, 0, 0, 
{
    mode: "shown",
    resizable: false,
    scale: 2
});

let buf = blueAndRed();
canvas.loadRawData(buf, 8);
canvas.dumpPNG("test.png");
canvas.sleep(3000);


function blueAndRed() {
    let buff = new Uint8Array(width * height);
    let r = false;
    for (let i = 0; i < buff.length; i++) {
        buff[i] = r ? 0b11100000 : 0b11;
        r = !r;
    }
    return buff;
}