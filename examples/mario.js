import { Canvas } from "../index.js";

const canvas = new Canvas("Mario", 500, 500);
canvas.loadTexture("mario", "assets/mario.png");
const marioRes = canvas.getTextureResolution("mario");
canvas.loop(() => {
    canvas.drawTexture("mario", { x: 20, y: canvas.getHeight() - marioRes.h });
});