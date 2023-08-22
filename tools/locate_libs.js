import fs from 'fs';

const SDL_paths = [
    "/lib/x86_64-linux-gnu/libSDL2-2.0.so",
    "/lib64/libSDL2-2.0.so.0"
];

const SDL_imagePaths = [
    "/lib/x86_64-linux-gnu/libSDL2_image-2.0.so.0",
    "/lib64/libSDL2_image-2.0.so.0"
];

const SDL_ttfPaths = [
    "/lib/x86_64-linux-gnu/libSDL2_ttf.so",
    "/lib64/libSDL2_ttf.so"
]


for (let path of SDL_paths) {
    if (fs.existsSync(path)) process.stdout.write(path + " ")
}

for (let path of SDL_imagePaths) {
    if (fs.existsSync(path)) process.stdout.write(path + " ")
}

for (let path of SDL_ttfPaths) {
    if (fs.existsSync(path)) process.stdout.write(path + " ")
}