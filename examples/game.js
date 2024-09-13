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

canvas.onKeysDown((keys) => {
    if (keys.includes("Up")) {
        if (playerCurrentPos.y === height - playerSize) {
            playerCurrentPos.y -= 1;
            playerVerticalSpeed = 10;
        }
    }
    if (keys.includes("Left")) {
        playerLateralSpeed = -10;
    }
    if (keys.includes("Right")) {
        playerLateralSpeed = 10;
    }
});

canvas.loop(() => {
    canvas.drawRectangle(Colors.RED, playerCurrentPos, playerSize, playerSize, true);
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
});
