import fs from "fs";
if (process.platform !== "win32") exit(0);
fs.rename("./build/Release/SDL2.dll", "./build/Debug/SDL2.dll", () => {})
fs.rename("./build/Release/SDL2_image.dll", "./build/Debug/SDL2_image.dll", () => {})
fs.rename("./build/Release/SDL2_ttf.dll", "./build/Debug/SDL2_ttf.dll", () => {})