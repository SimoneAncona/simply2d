import { Canvas, Colors } from "../index.js"

const width = 500;
const height = 500;
const canvas = new Canvas("use arrows", width, height);

let currentPosition = { x: width / 2, y: height / 2 };

canvas.onKeyDown((key) => {
    switch (key) {
        case "Up":
            currentPosition.y = currentPosition.y - 10;
            break;
        case "Down":
            currentPosition.y = currentPosition.y + 10;
            break;
        case "Left":
            currentPosition.x = currentPosition.x - 10
            break;
        case "Right":
            currentPosition.x = currentPosition.x + 10
            break;
    }
    update();
});

async function loop() {
    while (true) canvas.sleep(10);
}

function update() {
    canvas.clear();
    canvas.drawRectangle(Colors.RED, currentPosition, 10, 10, true);
}

update();
loop();