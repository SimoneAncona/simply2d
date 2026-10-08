import { existsSync } from 'node:fs';
const required = ['bin/sdl/winx64/SDL2', 'bin/sdlimg/winx64/SDL2_image', 'bin/sdlttf/winx64/SDL2_ttf'];
for (const base of required) {
  for (const extension of ['dll', 'lib']) {
    const file = `${base}.${extension}`;
    if (!existsSync(file)) throw new Error(`Missing Windows package dependency: ${file}`);
  }
}
