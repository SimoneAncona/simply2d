# Simply2D
## Introduction
This library for nodejs allows you, thanks to SDL2, to create windows and draw on the screen. 

## Installation
You can install this library using `npm i simply2d`. Node.js 22.22.2+, 24.15.0+, or 26+ is required.
This library require `SDL2` in order to run. Simple DirectMedia Layer is a cross-platform library designed to provide low level access to different resources such as video. SDL2 is available for windows, linux and macos as well.

### For Windows
Visual Studio VC tools are required. For more, see https://github.com/nodejs/node-gyp#readme

### For Linux
To use Simply2D you must have installed make, a C++17 compiler, Python 3, pkg-config and the SDL2 development packages. To install SDL2 you can use the following command:
- For Debian and Ubuntu: `sudo apt install build-essential python3 pkg-config libsdl2-dev libsdl2-image-dev libsdl2-ttf-dev`
- For Red Hat and Fedora: `sudo dnf install gcc-c++ make python3 pkgconf-pkg-config SDL2-devel SDL2_image-devel SDL2_ttf-devel`
- For Arch Linux: `sudo pacman -S --needed base-devel python pkgconf sdl2 sdl2_image sdl2_ttf`

> If you encounter any problems, it is recommended to install the latest version of python3 and run `python3 -m pip install setuptools` or just `pip install setuptools`


### For contributors
Windows x64 SDL runtime and import libraries are included in npm releases. The local `bin/` directory is ignored by Git. Before packing a release, populate it with the official SDL 2.32.10, SDL_image 2.8.12, and SDL_ttf 2.24.0 VC x64 libraries and their upstream licenses; CI downloads these automatically. Visual Studio C++ build tools and Python are still required to compile the Node addon.

Run `npm install`, then `npm run build`. Run `npm test` for the small animation, framebuffer, and window-event smoke tests. CI also builds on Windows and installs the packed npm release into a separate project.

## Preparing 1.4.0

The working version is `1.4.0-dev.0`.

### Drawing and frame timing

`canvas.loop(callback, { fps: 60, maxDeltaMs: 100 })` passes elapsed milliseconds to each frame. Drawing inside the callback is presented once. Set `clear: false` to retain the preceding frame. `canvas.endLoop()` stops the timer and restores immediate drawing.

Use `canvas.batch(() => { ... })` to group synchronous drawing outside a loop into one presentation. Nested batches share the presentation. Set `vsync: false` in the Canvas constructor options to disable vertical synchronization.

### Sprites and animations

```js
import { SpriteSheet } from "simply2d";

canvas.loadTexture("player", "player.png");
const sheet = new SpriteSheet("player", 16, 16, 4, 2);
const walk = sheet.animation([0, 1, 2, 3], { fps: 10 });
canvas.loop(deltaMs => {
    walk.update(deltaMs);
    canvas.drawAnimation(walk, { x: 40, y: 60 }, {
        width: 32, height: 32, flipX: false
    });
});
```

`SpriteAnimation` also accepts an array of source rectangles for irregular sprite sheets. Animations support `play(restart)`, `pause()`, `stop()`, `reset()`, and `loop: false`. Updating an animation is explicit, so drawing it more than once does not advance its timing.

`drawTexture(id, position, options)` supports a source rectangle, output width and height, rotation in degrees, horizontal and vertical flips, opacity from 0 to 1, and `filtering: "nearest" | "linear"`. Nearest sampling is the default. `unloadTexture(id)` releases a loaded texture.

### Audio

`Audio` provides WAV playback independently of a canvas. It supports 32 simultaneous playback instances. Files are decoded and converted once when loaded; playback and mixing run on SDL's audio thread.

```js
import { Audio } from "simply2d";

const audio = new Audio();
audio.loadSound("jump", "jump.wav");
audio.volume = 0.5;
const jump = audio.play("jump", { volume: 0.8 });
const background = audio.play("jump", { loop: true });
background.pause();
background.resume();
background.volume = 0.3;
background.stop();
audio.close();
```

`loadSound(id, filenameOrWavBytes)` accepts a path or `Uint8Array` containing encoded WAV data and returns duration in seconds. `getSoundDuration(id)` returns that duration. Each `play()` returns a separate `SoundPlayback` with `state`, `isPlaying`, `volume`, `pause()`, `resume()`, and `stop()`.

Master controls are `audio.volume`, `pause()`, `resume()`, `stopAll()`, and `unloadSound(id)`. Volume ranges from 0 to 1. Unloading stops instances of that loaded sound. Loading an existing ID replaces the sound for future playback while current instances finish with their original data. Playing when all 32 voices are occupied throws an error.

Call `audio.close()` when finished; closing a canvas leaves audio available. Playback does not keep the Node event loop alive. This version supports WAV, including conversion of sample rates and mono/stereo layouts; MP3, OGG, and streamed music are not supported. No additional native dependency is required.

Run `node examples/audio.js` for a standalone example. The Mario example includes original synthesized effects for jumping, coins, falls, and completing the level. Press M to mute, or start it with `--no-audio` to disable sound. If an audio device is unavailable, the game continues without sound.

### Window events

Handlers apply to the SDL canvas window. Each registration returns an unsubscribe function:

```js
const unsubscribe = canvas.onWindowResize((width, height) => {
    console.log(width, height); // logical canvas pixels
});
canvas.onWindowUnfocus(() => { paused = true; });
canvas.onWindowClose(() => unsavedChanges ? false : undefined);
```

Available handlers are `onWindowResize`, `onWindowMove`, `onWindowFocus`, `onWindowUnfocus`, `onWindowMinimize`, `onWindowMaximize`, `onWindowRestore`, `onWindowShow`, `onWindowHide`, `onWindowMouseEnter`, `onWindowMouseLeave`, and `onWindowClose`. `onWindowEvent(type, callback)` receives the corresponding event object.

Events are polled by the frame loop. Call `pollEvents()` when managing your own loop. `resize(width, height)` resizes in logical pixels and preserves existing canvas and layer pixels. Returning `false` from a close handler cancels `requestClose()` or the window close button; `close()` closes immediately.

### Examples and performance

- `node examples/mario.js`: platforming, scrolling, animated sprites, coins, checkpoints, pause, and restart. Move with arrows or A/D, jump with Space/Up/W, and run with Shift. P pauses, R restarts, and Escape closes.
- `node examples/animation.js`: sprite playback, scaling, flips, rotation, and opacity. Space pauses and R resets.
- `node examples/window-events.js`: SDL window handlers.
- `npm run bench`: compares immediate drawing with a single batch using 500 rectangles per frame.

Rendering changes include cached texture dimensions, font reuse, event polling at frame boundaries, and a paced frame loop. The previous loop already grouped drawing; the batching benchmark measures drawing outside that loop. Results depend on the renderer and machine.

## API
### Canvas
The `Canvas` class allows you to create a canvas and to draw on it
```ts
import { Canvas } from "simply2d";
const canvas = new Canvas(
	"my canvas",	// window title
	600,			// window width
	400,			// window height
);
```
You can specify other window options
```ts
const canvas = new Canvas("title", 200, 400, 0, 0, {
	mode: "fullscreen",
	resizable: false,
	scale: 2,
	antiAliasing: true
})
```

### Canvas.show
```ts
show(): void
```
Show the window

### Canvas.hide
```ts
hide(): void
```
Hide the window

### Canvas.setBackgroundColor
```ts
setBackgroundColor(color: RGBAColor): void
```
Set the background color. An RGBAColor is an object that contains `red`, `green`, `blue` and `alpha` properties.

### Canvas.sleep
```ts
sleep(ms: number): void
```
Sleep `ms` milliseconds

### Canvas.drawPoint
```ts
drawPoint(color: RGBAColor, position: Position): void
```
Draw a point on the screen. Position is an object with the x and y properties.

### Canvas.drawLine
```ts
drawLine(color: RGBAColor, from: Position, to: Position): void
```
Draw a line from `from` coordinates to `to` coordinates

### Canvas.drawRectangle
```ts
drawRectangle(color: RGBAColor, pos: Position, width: number, height: number, fill?: boolean): void
```
Draw a rectangle in the canvas

### get Canvas.width
```ts
get width(): number
```
Return the window width

### get Canvas.height
```ts
get height(): number
```
Return the window height

### Canvas.clear
```ts
clear(): void
```
Clear the screen

### Canvas.loadRawData
```ts
loadRawData(pixels: Uint8Array, bitPerPixel: 8 | 16 | 24 | 32): void
```
Write directly into the video buffer

### Canvas.loadPNG
```ts
loadPNG(filename: string): void
```
Write an PNG image into the canvas

### Canvas.loadJPG
```ts
loadJPG(filename: string): void
```
Write a JPG image into the canvas

### Canvas.dumpPNG
```ts
dumpPNG(filename: string): void
```
Save the canvas as a PNG file

### Canvas.dumpJPG
```ts
dumpJPG(filename: string): void
```
Save the canvas as a JPG file

### Canvas.getScale
```ts
getScale(): number
```
Return the scale factor

### Canvas.onClick
```ts
onClick(callback: (x: number, y: number) => void): void
```
On click event

### Canvas.onKeyDown
```ts
onKeyDown(callback: (key: Key) => void): void
```
On key down event

### Canvas.onKeyUp
```ts
onKeyUp(callback: (key: Key) => void): void
```
On key up event

### Canvas.initRenderSequence
```ts
initRenderSequence(): void
```
It is used to initialize the rendering sequence. Every drawing process will not be displayed until exposeRender is called

### Canvas.exposeRender
```ts
exposeRender(): void
```
Shows rendering

### Canvas.waitFrame
```ts
waitFrame(): void
```
Sleep for a certain time before the next frame is rendered

### Canvas.loop
```ts
loop(callback: () => void): void
```
Start the rendering loop

### Canvas.onKeysDown
```ts
onKeysDown(callback: (key: Key[]) => void): void
```
On keys down event

### Canvas.onKeysUp
```ts
onKeysUp(callback: (key: Key[]) => void): void
```
On keys up event

### Canvas.loadFont
```ts
loadFont(fontName: string, filePath: string): void
```
Load a new font

### Canvas.drawText
```ts
drawText(text: string, fontName: string, size: number, color: RGBAColor, start: Position): void
```
Draw text on the canvas 

### Canvas.drawArc
```ts
drawArc(color: RGBAColor, center: Position, radius: number, startingAngle: number, endingAngle: number): void
```
Draw an arc

### Canvas.convertPolarCords
```ts
static convertPolarCoords(center: Position, angle: number, radius: number): Position
```
Convert polar coordinates into x, y coordinates

### Canvas.loadTexture
```ts
loadTexture(textureID: string, filePath: string): void
```
Load a new texture from the specified file

### Canvas.drawTexture
```ts
drawTexture(textureID: string, pos: Position): void
```
Draw a previously loaded texture

### Canvas.getScreenResolution
```ts
static getScreenResolution(): Resolution
```
Get the screen resolution

### Canvas.getTextureResolution
```ts
getTextureResolution(textureID: string): Resolution
```
Get the resolution of a previously loaded texture

### Canvas.drawPath
```ts
drawPath(path: Path, pos?: Position, color?: RGBAColor)
```
Draw a path

### Canvas.addLayer
```ts
addLayer(layerId: string): void
```
Add a new layer

### Canvas.removeLayer
```ts
removeLayer(layerId: string): void
```
Remove layer

### Canvas.changeLayer
```ts
changeLayer(layerId: string): void
```
Change current layer

### Canvas.useMainLayer
```ts
useMainLayer(): void
```
Change to the main default layer

### get Canvas.frameTime
```ts
get frameTime(): number
```
Get current frame time, only if the scene is rendered with loop

### get Canvas.fps
```ts
get fps(): number
```
Get current frame time, only if the scene is rendered with loop

### Canvas.getLayers
```ts
getLayers(): Layer[]
```
Get layers in order of appearance

### Canvas.activateLayer
```ts
activateLayer(layerID: string): void
```
Activate a layer

### Canvas.deactivateLayer
```ts
deactivateLayer(layerID: string): void
```
Deactivate a layer

### get Canvas.antialiasing
```ts
get antialiasing(): boolean
```
Get antialiasing flag

### set Canvas.antialiasing
```ts
set antialiasing(): void
```
Set antialiasing flag

### Canvas.clearAll
```ts
clearAll(): void
```
Clear all layers, including the main layer

### Canvas.moveLayer
```ts
moveLayer(layerID: string, direction: "up" | "down", steps: number = 1): void
```
Change layer rendering priority

### Canvas.attach
```ts
attach(buffer: Uint8Array, bitPerPixel: PixelFormat): void
```
Attach a buffer to the video memory. The loop and every other drawing functions will be disabled.

### Canvas.detach
```ts
detach(): void
```
Detach the current buffer from the video memory

### Canvas.close
```ts
close(): void
```
Close the window

### Canvas.endLoop
```ts
endLoop(): void
```
Terminate the current loop

### get Canvas.mousePosition
```ts
get mousePosition(): Position
```
Return the current mouse position

### Canvas.applyFilter
```ts
applyFilter(fn: (value: number, index: number, buffer: Uint8Array) => number): void
```
Apply a callback to every byte of the current rendering target and display the result. The callback receives the byte value, byte index, and buffer. Updates happen in place, in index order; returned values are converted to unsigned bytes. This stops the render loop, like `attach`. Detach any existing buffer first. The temporary buffer is always detached, including when the callback throws.

```ts
canvas.applyFilter(value => Math.floor(value / 2));
```

### Canvas options
```ts
type CanvasOptions = {
	mode?: "fullscreen" | "minimized" | "maximized" | "hidden" | "shown",
	resizable?: boolean,
	scale?: number,
	antiAliasing?: boolean,
	removeWindowDecoration?: boolean
}
```

### Canvas constant positions
It is possible to access constant positions relative to the size of the canvas. Example:
```ts
import { Canvas, Colors } from "simply2d"

const canvas = new Canvas("myCanvas", 200, 200);
canvas.drawLine(Colors.BLUE, canvas.TOP_LEFT /* the top left corner */, canvas.BOTTOM_RIGHT /* the bottom right corner */);
```

### Colors
Colors is an object that contains different standard colors and some useful function
```ts
import { Canvas, Colors } from "simply2d";
const canvas = new Canvas("title", 100, 100);
canvas.setBackgroundColor(Colors.RED);	// #FF0000 hex color
canvas.drawLine(
	Colors.BLACK, 	// #000000 hex color
	{
		x: 0,
		y: 0
	},
	{
		x: canvas.getWidth(),
		y: canvas.getHeight()
	}
);
```

### Colors.from8bit
```ts
from8bit(color256: number): RGBAColor
```
Convert an 8 bit color into a 24 bit color

### Colors.from16bit
```ts
from16bit(color: number): RGBAColor
```
Convert a 16 bit color into a 24 bit color

### Colors.from24bit
```ts
from24bit(color: number): RGBAColor
```
Convert a 24 bit color number into a 24 bit color RGBAColor object

### Colors.from32bit
```ts
from32bit(color: number): RGBAColor
```
Convert a 32 bit color number into a RGBAColor object

### Position
Is a type for storing coordinates
```ts
import { Position } from "simply2d"	// only in typescript
let cord: Position = {
	x: 203,
	y: 301
}
```

### RGBAColor
Used to save RGBA color values
```ts
import { RGBAColor } from "simply2d"	// only in typescript
let color: RGBAColor = {
	red: 255,
	green: 255,
	blue: 0,
	alpha: 255
}
```

### Resolution
Used to save a pair of width and height values
```ts
import { Resolution } from "simply2d"
let res: Resolution = {
	w: 1920,
	h: 1080
}
```

### Path
A path is an object used to represent a polyline
```ts
import { Path } from "simply2d";
const p = new Path();
p.setStart({ x: 10, y: 15 });
p.pushLine({ x: 20, y: 60 });
p.close();
```

### PixelFormats
Static class that stores all the available pixel formats

```ts
PixelFormats.rgb332;
PixelFormats.rgb565;
PixelFormats.rgb888;
PixelFormats.rgba8888;
```
