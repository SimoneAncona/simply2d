import { Canvas, PixelFormats } from '../index.js';
const canvas = new Canvas("attached", 800, 600);
const pf = PixelFormats.rgb888;
let buffer = new Uint8Array(canvas.width * canvas.height * (pf / 8));
canvas.attach(buffer, pf);


setTimeout(() => { 
    for (let i = 0; i < buffer.length; i += 3) buffer[i] = 0xff
}, 100);