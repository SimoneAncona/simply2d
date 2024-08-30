# Future implementations

### Path optimization

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