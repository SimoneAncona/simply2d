# Future implementations

### Canvas.drawCircle
```ts
drawArc(radius: number, angle: number /* radians */, center: Position): void
```
Draw an arc

### Canvas.drawPath
```ts
drawPath(path: Path): void
```
Draw a polyline

### Canvas.getRawData
```ts
getRawData(): Uint8Array
```
Get the canvas video buffer

### Path
```ts
import { Path } from "simply2d";
const house = new Path();
house.start({ x: 10, y: 15 });
house.pushLine({ x: 20, y: 60 });
```