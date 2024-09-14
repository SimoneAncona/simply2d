import { Canvas, PixelFormats } from '../index.js';
const canvas = new Canvas("attached", 800, 600);
const pf = PixelFormats.rgb888;
let buffer = new Uint8Array(canvas.width * canvas.height * (pf / 8));
canvas.attach(buffer, pf);

setTimeout(() => { 
    for (let i = 0; i < buffer.length; i += 3) buffer[i] = 0xff
}, 1000);

setTimeout(() => { 
    for (let i = 0; i < buffer.length; i += 3) {
        buffer[i] = 0;
        buffer[i + 1] = 0xff;
    } 
}, 2000);

setTimeout(() => { 
    for (let i = 1; i < buffer.length; i += 3) {
        buffer[i] = 0;
        buffer[i + 1] = 0xff;
    } 
}, 3000);

setTimeout(() => {
    canvas.detach();
    canvas.close();
}, 4000);