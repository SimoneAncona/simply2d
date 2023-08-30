# Future implementations

### Optimization
- Texture loading optimization (pointer to texture buffer)
- Same thing for fonts

### Canvas.drawPath
```ts
drawPath(path: Path): void
```
Draw a polyline

### Canvas.loadSVG
```ts
loadSVG(filename: string): void
```
Load SVG file

### Canvas.attach
```ts
attach(array: Uint8Array, bitsPerPixel: 8 | 16 | 24 | 32): void
```
Attach an array to the video memory. Every change to the array will be reflected in the video memory.

### Canvas.detach
```ts
detach(): void
```
Detach the array

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

### Canvas.getLayers
```ts
getLayers(): Layer[]
```
Get layers in order of appearance

### Canvas.moveLayer
```ts
moveLayer(layerId: string, direction: "top" | "bottom", steps: number): void
```
Change layer rendering priority

### Path
```ts
import { Path } from "simply2d";
const house = new Path();
house.start({ x: 10, y: 15 });
house.pushLine({ x: 20, y: 60 });
```

### Entity
```ts
import { Entity } from "simply2d";
import { Canvas } from "simply2d";

const canvas = new Canvas("title", 100, 100);

const player = new Entity("player");
player.physics = {
	gravity: true,
	collision: true
};

player.setTexture("assets/file.png");

player.onKeyDown((key: Key) => { /* ... */ });

canvas.addEntity(player);
canvas.removeEntity("player");
```
