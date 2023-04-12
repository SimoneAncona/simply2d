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
dumpPNG(): void
```
Used to save the canvas as a PNG file

### Canvas.dumpJPG
```js
dumpJPG(): void
```
Used to save the canvas as a JPG file