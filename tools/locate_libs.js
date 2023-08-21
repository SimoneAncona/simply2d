import fs from 'fs';

const SDL_paths = [
    "/lib/x86_64-linux-gnu/libSDL2-2.0.so",
    "/lib64/libSDL2-2.0.so.0"
];

const SDL_imagePaths = [
    "/lib/x86_64-linux-gnu/libSDL2_image-2.0.so.0",
    "/lib64/libSDL2_image-2.0.so.0"
];

let searchPathArray = SDL_paths;

if (process.argv[2] == "-i")
    searchPathArray = SDL_imagePaths;

for (let path of searchPathArray) {
    if (fs.existsSync(path)) console.log(path)
}