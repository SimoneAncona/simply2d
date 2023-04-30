# Future implementations
### CanvasOptions.scale
```ts
type CanvasOptions = {
	mode: "fullscreen" | "minimized" | "maximized" | "hidden" | "shown",
	resizable: boolean,
    scale: number  // adding a scale factor
}
```

### Canvas.dumpPNG
```js
dumpPNG(filename: string): void
```
Used to save the canvas as a PNG file

### Canvas.dumpJPG
```js
dumpJPG(filename: string): void
```
Used to save the canvas as a JPG file

### Canvas.drawCircle
```js
drawArc(radius: number, angle: number /* radians */, center: Position): void
```
Draw an arc

### Canvas.drawPath
```js
drawPath(path: Path): void
```
Draw a polyline

### Canvas.on
```js
on(event: string, callback: () => void): void
```
Event listener

### Path
```js
import { Path } from "simply2d";
const house = new Path();
house.start({x: 10, y: 15});
house.pushLine({x: 20, y: 60});
```