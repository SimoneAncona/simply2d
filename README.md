# Simply2D
## Introduction
This library for nodejs allows, thanks to SDL2, to create windows and draw on the screen. 

## Installation
You can install this library using `npm i simply2d`.  
This library require `SDL2` in order to run. Simple DirectMedia Layer is a cross-platform library designed to provide low level access to different resources such as video. SDL2 is available for windows, linux and macos as well
### Windows installation
To install `SDL2` on windows:
- <a href="https://github.com/libsdl-org/SDL/releases/download/release-2.26.5/SDL2-devel-2.26.5-VC.zip">Click this link</a> to download the `SDL2` dev library
- Unzip the file in `C:\SDL`
- <a href="https://github.com/libsdl-org/SDL_image/releases/download/release-2.6.3/SDL2_image-devel-2.6.3-VC.zip">Click here</a> to download the `SDL2_Image` dev library
- Unzip the file in `C:\SDL_Image`

### Linux installation
> Linux is not fully supported right now
#### Ubuntu
To install SDL2 and SLD2_Image run this command in the bash
```bash
sudo apt-get libsdl2-dev libsdl2-image-dev
```

## API
### Canvas
The `Canvas` class allows you to create a canvas and to drew on it
```js
import { Canvas } from "simply2d";
const canvas = new Canvas(
	"my canvas",	// window title
	600,			// window width
	400,			// window height
);
```
You can specify other window options
```js
const canvas = new Canvas("title", 200, 400, {
	mode: "fullscreen",
	resizable: false
})
```

### Canvas.show
```js
show(): void
```
Show the window

### Canvas.hide
```js
hide(): void
```
Hide the window

### Canvas.setBackgroundColor
```js
setBackgroundColor(color: RGBAColor): void
```
Set the background color

### Canvas.sleep
```js
sleep(ms: number): void
```
Sleep `ms` milliseconds

### Canvas.drawPoint
```js
drawPoint(color: RGBAColor, position: Position): void
```
Draw a point on the screen

### Canvas.drawLine
```js
drawLine(color: RGBAColor, from: Position, to: Position): void
```
Draw a line from `from` coordinates to `to` coordinates

### Canvas.drawRectangle
```js
drawRectangle(color: RGBAColor, center: Position, width: number, height: number): void
```
Draw a rectangle in the canvas

### Canvas.getWidth
```js
getWidth(): void
```
Return the window width

### Canvas.getHeight
```js
getHeight(): void
```
Return the window height

### Canvas.clear
```js
clear(): void
```
Clear the screen

### Canvas.loadRawData
```js
loadRawData(pixels: Uint8Array, bitPerPixel: 8 | 16 | 24 | 32): void
```
Write directly into the video buffer

### Canvas.loadPNG
```js
loadPNG(filename: string): void
```
Write an PNG image into the canvas

### Canvas.loadJPG
```js
loadJPG(filename: string): void
```
Write a JPG image into the canvas

### Canvas.dumpPNG
```js
dumpPNG(filename: string): void
```
Save the canvas as a PNG file

### Canvas.dumpJPG
```js
dumpJPG(filename: string): void
```
Save the canvas as a JPG file

### Colors
Colors is an object that contains different standard colors and some useful function
```js
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
```js
from8bit(color256: number): RGBAColor
```
Convert an 8 bit color into a 24 bit color

### Colors.from16bit
```js
from16bit(color: number): RGBAColor
```
Convert a 16 bit color into a 24 bit color

### Colors.from24bit
```js
from24bit(color: number): RGBAColor
```
Convert a 24 bit color number into a 24 bit color RGBAColor object

### Colors.from32bit
```js
from32bit(color: number): RGBAColor
```
Convert a 32 bit color number into a RGBAColor object

### Position
Is a type for storing coordinates
```ts
import { Position } from "simply2d"	// only in typescript
cord: Position = {
	x: 203,
	y: 301
}
```

### RGBAColor
Used to save RGBA color values
```ts
import { RGBAColor } from "simply2d"	// only in typescript
cord: RGBAColor = {
	red: 255,
	green: 255,
	blue: 0,
	alpha: 255
}
```