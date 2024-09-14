import { Canvas, PixelFormats, Colors } from "../index.js";
const width = 300;
const height = 300;
const canvas = new Canvas("Random noise", width, height, null, null, { scale: 4, removeWindowDecoration: true });
let buf = new Uint8Array(width * height * (PixelFormats.rgb888 / 8));
canvas.drawLine(Colors.WHITE, canvas.TOP_CENTER, canvas.BOTTOM_CENTER);
canvas.attach(buf, PixelFormats.rgb888);
canvas.sleep(5000);
setInterval(() => {
    for (let i = 0; i < buf.length; i++) buf[i] = Math.floor(Math.random() * 255);
    return buf;
});