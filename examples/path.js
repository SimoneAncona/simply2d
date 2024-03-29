import { Canvas, Colors, Path } from "../index.js";
const canvas = new Canvas("My Canvas", 280, 210);
const house = new Path();
house.setStart({x: 20, y: 40});
house.pushLine({x: 40, y: 40});
house.pushLine({x: 40, y: 25});
house.pushLine({x: 50, y: 25});
house.pushLine({x: 50, y: 40});
house.pushLine({x: 50, y: 40});
house.pushLine({x: 70, y: 40});
house.pushLine({x: 70, y: 10});
house.pushLine({x: 80, y: 10});
house.pushLine({x: 45, y: 0});
house.pushLine({x: 10, y: 10});
house.pushLine({x: 20, y: 10});
house.close();
canvas.drawPath(house, {x: 20, y: 20});
canvas.sleep(1000);
