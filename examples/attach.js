import { Canvas, PixelFormats, Colors } from '../index.js';
const canvas = new Canvas("attached", 800, 600);
const pf = PixelFormats.rgb888;
let buffer = new Uint8Array(canvas.width * canvas.height * (pf / 8));
canvas.drawLine(Colors.GREEN, canvas.BOTTOM_LEFT, canvas.TOP_RIGHT);
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
    canvas.drawLine(Colors.WHITE, canvas.TOP_LEFT, canvas.BOTTOM_RIGHT);
    canvas.sleep(2000);
    canvas.close();
}, 4000);