# Simply2D
## Introduction
This library allows, thanks to SDL2, to create windows and draw on the screen

## Installation
This library require `SDL2` in order to run. Simple DirectMedia Layer is a cross-platform library designed to provide low level access to different resources such as video. SDL2 is available for windows, linux and macos as well
### Windows installation
To install `SDL2` on windows:
- <a href="https://github.com/libsdl-org/SDL/releases/download/release-2.26.5/SDL2-devel-2.26.5-mingw.zip">Click this link</a> to download the SDL2 dev library
- Unzip the file in `C:\`
### Linux installation
> Linux is not fully supported right now

## References
### Canvas
The `Canvas` class allows you to create a canvas and to drow on it
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
	resizeable: false
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
Set the backgroud color

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

### Colors
Colors is an object that contains different standard colors and some useful function
```js
import { Colors } from "simply2d";
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