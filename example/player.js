import { Canvas, Colors } from "../index.js";

const height = 500;
const width = 500;
const playerSize = 10;

const canvas = new Canvas("title", height, width);

let playerCurrentPos = { x: 20, y: height - playerSize };
let playerVerticalSpeed = 0;
let playerLateralSpeed = 0;

const friction = 1;
const gravity = 1;

async function loop() { while (true) { update(); } }

canvas.onKeyDown((key) => {
    switch (key) {
        case "Up":
            if (playerCurrentPos.y === height - playerSize) {
                playerVerticalSpeed = 10;
                playerCurrentPos.y -= 1;
            }
            break;
        case "Down":

            break;
        case "Left":
            playerLateralSpeed = -10;
            break;
        case "Right":
            playerLateralSpeed = 10;
            break;
    }
});

function update() {
    canvas.initRenderSequence();
    canvas.clear();
    canvas.drawRectangle(Colors.BLUE, playerCurrentPos, playerSize, playerSize, true);
    canvas.exposeRender();
    canvas.waitFrame();
    if (playerCurrentPos.y <= height - playerSize) {
        playerVerticalSpeed -= gravity;
        playerCurrentPos.y -= playerVerticalSpeed;
    } else {
        playerCurrentPos.y = height - playerSize;
    }
    if (playerLateralSpeed !== 0) {
        playerLateralSpeed < 0 ? playerLateralSpeed += friction : playerLateralSpeed -= friction;
        playerCurrentPos.x += playerLateralSpeed;
    }
}


loop();
