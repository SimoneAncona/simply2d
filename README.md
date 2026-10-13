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
- For Debian and Ubuntu: `sudo apt install build-essential python3 pkg-config libsdl2-dev libsdl2-image-dev libsdl2-ttf-dev libsdl2-mixer-dev`
- For Red Hat and Fedora: `sudo dnf install gcc-c++ make python3 pkgconf-pkg-config SDL2-devel SDL2_image-devel SDL2_ttf-devel SDL2_mixer-devel`
- For Arch Linux: `sudo pacman -S --needed base-devel python pkgconf sdl2 sdl2_image sdl2_ttf sdl2_mixer`

> If you encounter any problems, it is recommended to install the latest version of python3 and run `python3 -m pip install setuptools` or just `pip install setuptools`


### For contributors
Windows x64 SDL runtime and import libraries are included in npm releases. The local `bin/` directory is ignored by Git. Before packing a release, populate it with the official SDL 2.32.10, SDL_image 2.8.12, SDL_ttf 2.24.0, and SDL_mixer 2.8.2 VC x64 libraries and their upstream licenses; CI downloads these automatically. Visual Studio C++ build tools and Python are still required to compile the Node addon.

Run `npm install`, then `npm run build`. Run `npm test` for the collision, animation, framebuffer, window-event, and audio smoke tests. CI also builds on Windows and installs the packed npm release into a separate project.

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

### Canvas.resize
```ts
resize(width: number, height: number): void
```
Resize the window in logical canvas pixels. Existing canvas and layer pixels are preserved.

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
loop(callback: (deltaMs: number) => void, options?: LoopOptions): void
```
Start the rendering loop. The callback receives elapsed milliseconds. Drawing is displayed once per frame. Defaults to 60 fps and limits elapsed time to 100 ms. Use `clear: false` to keep the previous frame.

### Canvas.batch
```ts
batch(callback: () => void): void
```
Draw synchronously and display once when the callback finishes. Nested batches share the same display update.

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

### Canvas.convertPolarCoords
```ts
static convertPolarCoords(center: Position, angle: number, radius: number): Position
```
Convert polar coordinates into x, y coordinates

### Canvas.loadTexture
```ts
loadTexture(textureID: string, filePath: string): void
```
Load a new texture from the specified file

### Canvas.loadSVG
```ts
loadSVG(textureID: string, source: string | Uint8Array, options?: SVGOptions): void
```
Load an SVG file or SVG bytes as a texture. Omit dimensions for the original size, or supply one dimension to preserve the aspect ratio. Rasterization happens when loading. Requires SDL_image 2.6.0 or later.

### Canvas.drawTexture
```ts
drawTexture(textureID: string, pos: Position, options?: TextureDrawOptions): void
```
Draw a previously loaded texture. Options control cropping, size, rotation, flips, opacity and filtering. Nearest filtering is used by default.

### Canvas.unloadTexture
```ts
unloadTexture(textureID: string): void
```
Release a loaded texture.

### Canvas.drawAnimation
```ts
drawAnimation(animation: SpriteAnimation, pos: Position, options?: Omit<TextureDrawOptions, "source">): void
```
Draw the current animation frame. Call `animation.update(deltaMs)` separately to advance playback.

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
Get the current frames per second, only if the scene is rendered with loop

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
Write the final buffer changes to the canvas and detach it from the video memory

### Canvas.requestClose
```ts
requestClose(): void
```
Request to close the window. Returning `false` from an `onWindowClose` handler cancels the request. `close()` closes immediately.

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

### Canvas.pollEvents
```ts
pollEvents(): void
```
Process pending window and input events. The rendering loop calls this automatically.

### Canvas.onWindowEvent
```ts
onWindowEvent(type: WindowEventType, callback: WindowEventHandler): () => void
```
Register a window event handler. The returned function removes the handler. Events refer to the canvas window.

### Canvas.onWindowResize
```ts
onWindowResize(callback: (width: number, height: number) => void): () => void
```
On window resize. Width and height are in logical canvas pixels. The returned function removes the handler.

### Canvas.onWindowMove
```ts
onWindowMove(callback: (x: number, y: number) => void): () => void
```
On window move. Coordinates are in screen pixels. The returned function removes the handler.

### Canvas.onWindowFocus
```ts
onWindowFocus(callback: () => void): () => void
```
On window focus. The returned function removes the handler.

### Canvas.onWindowUnfocus
```ts
onWindowUnfocus(callback: () => void): () => void
```
On window focus lost. The returned function removes the handler.

### Canvas.onWindowMinimize
```ts
onWindowMinimize(callback: () => void): () => void
```
On window minimized. The returned function removes the handler.

### Canvas.onWindowMaximize
```ts
onWindowMaximize(callback: () => void): () => void
```
On window maximized. The returned function removes the handler.

### Canvas.onWindowRestore
```ts
onWindowRestore(callback: () => void): () => void
```
On window restored. The returned function removes the handler.

### Canvas.onWindowShow
```ts
onWindowShow(callback: () => void): () => void
```
On window shown. The returned function removes the handler.

### Canvas.onWindowHide
```ts
onWindowHide(callback: () => void): () => void
```
On window hidden. The returned function removes the handler.

### Canvas.onWindowMouseEnter
```ts
onWindowMouseEnter(callback: () => void): () => void
```
On mouse entering the window. The returned function removes the handler.

### Canvas.onWindowMouseLeave
```ts
onWindowMouseLeave(callback: () => void): () => void
```
On mouse leaving the window. The returned function removes the handler.

### Canvas.onWindowClose
```ts
onWindowClose(callback: () => boolean | void): () => void
```
On window close requested. Return `false` to cancel closing. The returned function removes the handler.

### Canvas options
```ts
type CanvasOptions = {
	mode?: "fullscreen" | "minimized" | "maximized" | "hidden" | "shown",
	resizable?: boolean,
	scale?: number,
	antiAliasing?: boolean,
	removeWindowDecoration?: boolean,
	vsync?: boolean
}
```

Set `resizable` to `true` to allow window resizing. Non-resizable canvases keep their logical size unless `resize()` is called. Set `vsync` to `false` to disable vertical synchronization.

### Canvas constant positions
It is possible to access constant positions relative to the size of the canvas. Example:
```ts
import { Canvas, Colors } from "simply2d"

const canvas = new Canvas("myCanvas", 200, 200);
canvas.drawLine(Colors.BLUE, canvas.TOP_LEFT /* the top left corner */, canvas.BOTTOM_RIGHT /* the bottom right corner */);
```

### SpriteSheet
A sprite sheet stores a regular grid of frames. Indexes run from left to right, then down.
```ts
import { SpriteSheet } from "simply2d";
const sheet = new SpriteSheet("player", 16, 16, 4, 2);
```
The constructor takes the texture ID, frame width, frame height, columns and rows. Load the texture with `Canvas.loadTexture` first.

### SpriteSheet.frame
```ts
frame(index: number): Rectangle
```
Return the source rectangle for a frame.

### SpriteSheet.animation
```ts
animation(indexes: readonly number[], options?: AnimationOptions): SpriteAnimation
```
Create an animation from frame indexes.

### SpriteAnimation
An animation stores source rectangles and playback timing.
```ts
import { SpriteAnimation } from "simply2d";
const walk = new SpriteAnimation("player", [
	{ x: 0, y: 0, width: 16, height: 16 },
	{ x: 16, y: 0, width: 16, height: 16 }
], { fps: 10 });

canvas.loop(deltaMs => {
	walk.update(deltaMs);
	canvas.drawAnimation(walk, { x: 40, y: 60 });
});
```

### get SpriteAnimation.frame
```ts
get frame(): Readonly<Rectangle>
```
Return the current source rectangle.

### get SpriteAnimation.frameIndex
```ts
get frameIndex(): number
```
Return the current frame index.

### get SpriteAnimation.isPlaying
```ts
get isPlaying(): boolean
```
Return whether the animation is playing.

### get SpriteAnimation.finished
```ts
get finished(): boolean
```
Return whether a non-looping animation has finished.

### SpriteAnimation.update
```ts
update(deltaMs: number): void
```
Advance playback by elapsed milliseconds. Update once per frame, even when drawing the animation more than once.

### SpriteAnimation.play
```ts
play(restart?: boolean): void
```
Resume playback. Set `restart` to `true` to start from the first frame. Finished animations restart automatically.

### SpriteAnimation.pause
```ts
pause(): void
```
Pause playback on the current frame.

### SpriteAnimation.stop
```ts
stop(): void
```
Stop playback and return to the first frame.

### SpriteAnimation.reset
```ts
reset(): void
```
Return to the first frame without changing whether playback is paused.

### Audio
Audio uses SDL_mixer to play WAV, MP3, OGG and FLAC files. One Audio instance can be open at a time, with 32 sound effects and one music track playing together.
```ts
import { Audio } from "simply2d";
const audio = new Audio();
audio.loadSound("jump", "jump.wav");
audio.play("jump");
audio.loadMusic("theme", "theme.ogg");
audio.playMusic("theme", { loop: true });
```
SDL_mixer 2.6.0 or later is required. Sound effects are loaded into memory; music is streamed from files. Playback does not keep the Node.js event loop alive.

### Audio.loadSound
```ts
loadSound(id: string, source: string | Uint8Array): number
```
Load a sound from a file or encoded audio bytes. Return its duration in seconds. Replacing an ID affects future playback; existing instances keep their original sound.

### Audio.getSoundDuration
```ts
getSoundDuration(id: string): number
```
Return the duration of a loaded sound in seconds.

### Audio.play
```ts
play(id: string, options?: SoundOptions): SoundPlayback
```
Play a loaded sound and return its playback controls. Each call creates a separate playback instance. Throws when all 32 sound channels are in use.

### Audio.unloadSound
```ts
unloadSound(id: string): void
```
Stop playback instances of the loaded sound and release it.

### Audio.loadMusic
```ts
loadMusic(id: string, filename: string): void
```
Load a music file for streaming.

### Audio.playMusic
```ts
playMusic(id: string, options?: SoundOptions): SoundPlayback
```
Play a loaded music track and return its playback controls. Replaces the current track.

### Audio.unloadMusic
```ts
unloadMusic(id: string): void
```
Release a loaded music track. Stop it if it is playing.

### get Audio.volume
```ts
get volume(): number
```
Return the master volume.

### set Audio.volume
```ts
set volume(value: number)
```
Set the volume of music and sound effects, from 0 to 1. Defaults to 1.

### get Audio.paused
```ts
get paused(): boolean
```
Return whether all audio is paused.

### Audio.pause
```ts
pause(): void
```
Pause music and sound effects.

### Audio.resume
```ts
resume(): void
```
Resume audio. Instances paused individually remain paused.

### Audio.stopAll
```ts
stopAll(): void
```
Stop music and all sound effects.

### Audio.close
```ts
close(): void
```
Stop playback and release the audio device. Closing a canvas does not close audio.

### get Audio.closed
```ts
get closed(): boolean
```
Return whether the audio device is closed.

### SoundPlayback
Playback controls returned by `Audio.play` and `Audio.playMusic`.
```ts
const sound = audio.play("jump", { volume: 0.5 });
sound.pause();
sound.resume();
sound.stop();
```

### get SoundPlayback.state
```ts
get state(): PlaybackState
```
Return `"playing"`, `"paused"` or `"stopped"`.

### get SoundPlayback.isPlaying
```ts
get isPlaying(): boolean
```
Return whether this instance is playing.

### get SoundPlayback.volume
```ts
get volume(): number
```
Return the instance volume.

### set SoundPlayback.volume
```ts
set volume(value: number)
```
Set the instance volume, from 0 to 1. The master volume also applies.

### SoundPlayback.pause
```ts
pause(): void
```
Pause this playback instance.

### SoundPlayback.resume
```ts
resume(): void
```
Resume this playback instance.

### SoundPlayback.stop
```ts
stop(): void
```
Stop this playback instance.

### rectanglesOverlap
```ts
rectanglesOverlap(a: Rectangle, b: Rectangle, touching?: boolean): boolean
```
Return whether two axis-aligned rectangles overlap. Set `touching` to `true` to count touching edges. Defaults to `false`.

### rectangleIntersection
```ts
rectangleIntersection(a: Rectangle, b: Rectangle): Rectangle | null
```
Return the overlap rectangle, or `null` when separated or only touching.

### rectangleContact
```ts
rectangleContact(a: Rectangle, b: Rectangle): RectangleContact | null
```
Return the smallest axis-aligned translation needed to move the first rectangle out of the second, or `null` when they do not overlap. Inputs are not changed.

### pointInRectangle
```ts
pointInRectangle(point: Position, rect: Rectangle, touching?: boolean): boolean
```
Return whether a point is inside a rectangle. Boundaries count by default; set `touching` to `false` to exclude them.

### circlesOverlap
```ts
circlesOverlap(a: Circle, b: Circle, touching?: boolean): boolean
```
Return whether two circles overlap. Set `touching` to `true` to count touching edges. Defaults to `false`.

### circleIntersectsRectangle
```ts
circleIntersectsRectangle(circle: Circle, rect: Rectangle, touching?: boolean): boolean
```
Return whether a circle overlaps an axis-aligned rectangle. Set `touching` to `true` to count touching edges. Defaults to `false`.

Collision functions use logical coordinates. Zero-size shapes do not collide. Rotated shapes and continuous motion are not supported; the Mario example uses small time steps for movement.

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

### Rectangle
```ts
type Rectangle = Position & { width: number, height: number };
```
A rectangle with its position at the top left corner.

### Circle
```ts
type Circle = Position & { radius: number };
```
A circle with its position at the center.

### RectangleContact
```ts
type RectangleContact = {
	depth: number,
	normal: Position,
	translation: Position
};
```
Collision depth, outward direction and the translation needed to separate the first rectangle from the second.

### TextureDrawOptions
```ts
type TextureDrawOptions = {
	source?: Rectangle,
	width?: number,
	height?: number,
	rotation?: number,
	flipX?: boolean,
	flipY?: boolean,
	opacity?: number,
	filtering?: "nearest" | "linear"
};
```
Source coordinates are in texture pixels. Rotation is in degrees and opacity ranges from 0 to 1. Defaults to the source size, no rotation or flips, full opacity and nearest filtering.

### SVGOptions
```ts
type SVGOptions = {
	width?: number,
	height?: number
};
```
SVG rasterization size in pixels. Dimensions must be positive integers. Supply one dimension to preserve the aspect ratio, or both for an explicit size.

### LoopOptions
```ts
type LoopOptions = {
	fps?: number,
	maxDeltaMs?: number,
	clear?: boolean
};
```
Defaults to 60 fps, a maximum elapsed time of 100 ms and clearing the canvas each frame.

### AnimationOptions
```ts
type AnimationOptions = {
	fps?: number,
	loop?: boolean,
	autoplay?: boolean
};
```
Defaults to 12 fps, looping and automatic playback. Set `loop: false` to play once.

### SoundOptions
```ts
type SoundOptions = {
	loop?: boolean,
	volume?: number
};
```
Defaults to no looping and volume 1. Volume ranges from 0 to 1.

### PlaybackState
```ts
type PlaybackState = "playing" | "paused" | "stopped";
```
Current state of a sound or music playback instance.

### WindowEventType
```ts
type WindowEventType = "resize" | "focus" | "unfocus" | "move"
	| "minimize" | "maximize" | "restore" | "show" | "hide"
	| "mouseEnter" | "mouseLeave" | "close";
```
Available canvas window events.

### WindowEvent
```ts
type WindowEvent = {
	type: WindowEventType,
	width?: number,
	height?: number,
	x?: number,
	y?: number
};
```
Resize events provide logical width and height. Move events provide screen coordinates.

### WindowEventHandler
```ts
type WindowEventHandler = (event: WindowEvent) => boolean | void;
```
Callback for `Canvas.onWindowEvent`. Returning `false` from a close handler cancels closing.
