import { Canvas } from '../index.js'

let a = new Uint8Array(4);
a[0] = 10
console.log(a[0]);
const canvas = new Canvas("", 10, 10)
canvas.ll(a)
a[0] = 1
canvas.cc()