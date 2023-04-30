# Future implementations
### CanvasOptions.scale
```ts
type CanvasOptions = {
	mode: "fullscreen" | "minimized" | "maximized" | "hidden" | "shown",
	resizable: boolean,
    scale: number  // adding a scale factor
}
```

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

### Canvas.getRawData
```js
getRawData(): Uint8Array
```
Get the canvas video buffer

### Path
```js
import { Path } from "simply2d";
const house = new Path();
house.start({x: 10, y: 15});
house.pushLine({x: 20, y: 60});
```