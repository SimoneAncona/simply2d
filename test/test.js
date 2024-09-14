import { Canvas, Colors } from '../index.js'


const canvas = new Canvas("ciao", 100, 100, null, null, { scale: 5 });
canvas.drawLine(Colors.WHITE, {x: 0, y: 0}, {x: 100, y: 100});
canvas.sleep(500);
canvas.loop(() => console.log(canvas.mousePosition));