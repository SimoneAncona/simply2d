import { existsSync } from 'node:fs';
const required = ['bin/sdl/winx64/SDL2', 'bin/sdlimg/winx64/SDL2_image', 'bin/sdlttf/winx64/SDL2_ttf', 'bin/sdlmixer/winx64/SDL2_mixer'];
for (const base of required) {
  for (const extension of ['dll', 'lib']) {
    const file = `${base}.${extension}`;
    if (!existsSync(file)) throw new Error(`Missing Windows package dependency: ${file}`);
  }
}

if (!existsSync('bin/sdlmixer/winx64/libgme.dll')) throw new Error('Missing Windows mixer codec: libgme.dll');
if (!existsSync('bin/sdlmixer/winx64/libogg-0.dll')) throw new Error('Missing Windows mixer codec: libogg-0.dll');
if (!existsSync('bin/sdlmixer/winx64/libopus-0.dll')) throw new Error('Missing Windows mixer codec: libopus-0.dll');
if (!existsSync('bin/sdlmixer/winx64/libopusfile-0.dll')) throw new Error('Missing Windows mixer codec: libopusfile-0.dll');
if (!existsSync('bin/sdlmixer/winx64/libwavpack-1.dll')) throw new Error('Missing Windows mixer codec: libwavpack-1.dll');
if (!existsSync('bin/sdlmixer/winx64/libxmp.dll')) throw new Error('Missing Windows mixer codec: libxmp.dll');
