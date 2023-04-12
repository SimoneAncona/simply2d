# Future implementations
### CanvasOptions.scale
```ts
type CanvasOptions = {
	mode: "fullscreen" | "minimazied" | "maximized" | "hidden" | "shown",
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
drawArc(radius: number, angle: number /* radians */, pos: Position): void
```
Draw an arc

### Canvas.drawPath
```js
drawPath(path: Path): void
```
Draw a polyline

### Path
```js
import { Path } from "simply2d";
const house = new Path();
```