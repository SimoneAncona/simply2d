import { Canvas } from "../index.js"
import * as path from "path";

const canvas = new Canvas("ciao", 100, 200);
canvas.loadPNG(
    path.join(
        process.cwd(),
        "example/assets/png_test.png"
    )
)