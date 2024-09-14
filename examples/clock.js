import { Canvas, Colors } from "../index.js";

const canvas = new Canvas("clock", 600, 600);
canvas.loadFont("roboto", "assets/Roboto-Regular.ttf")
function drawHands(date) {
    const seconds = date.getSeconds() / 60 * Math.PI * 2 - Math.PI / 2;
    const minutes = date.getMinutes() / 60 * Math.PI * 2 - Math.PI / 2;
    const hours = date.getHours() / 12 * Math.PI * 2 - Math.PI / 2;

    canvas.drawLine(Colors.AQUAMARINE, canvas.CENTER, Canvas.convertPolarCoords(canvas.CENTER, seconds, 170));
    canvas.drawLine(Colors.AQUAMARINE, canvas.CENTER, Canvas.convertPolarCoords(canvas.CENTER, minutes, 150));
    canvas.drawLine(Colors.AQUAMARINE, canvas.CENTER, Canvas.convertPolarCoords(canvas.CENTER, hours, 130));
}

function drawText(date) {
    let pos = { x: canvas.CENTER.x, y: canvas.CENTER.y };
    const width = 100;
    const height = 50;
    pos.x -= width / 2;
    pos.y -= height / 2;
    canvas.drawRectangle(Colors.BLACK, pos, width, height, true);
    canvas.drawText(date.getHours() + ":" + date.getMinutes(), "roboto", 38, Colors.WHITE, pos);
}

canvas.loop(() => {
    const date = new Date();
    canvas.drawArc(Colors.WHITE, canvas.CENTER, 200, 0, Math.PI * 2);
    drawText(date);
    drawHands(date);
});