import { Shape } from "./Shape";
import { Point } from "./Point";

export class Triangle extends Shape {
  constructor(p1: Point, p2: Point, p3: Point);
  constructor(p1: Point, p2: Point, p3: Point, color?: string, filled?: boolean) {
    super([p1, p2, p3], color, filled);
  }

  getType(): string {
    const side1 = this.points[0].distance(this.points[1]);
    const side2 = this.points[1].distance(this.points[2]);
    const side3 = this.points[2].distance(this.points[0]);
    if (Math.round(side1) === Math.round(side2) && Math.round(side2) === Math.round(side3)) {
      return "equilateral triangle";
    } else if (side1 === side2 || side1 === side3 || side2 === side3) {
      return "isosceles triangle";
    } else {
      return "scalene triangle";
    }
  }

  toString(): string {
    return `Triangle[v1=${this.points[0].toString()},v2=${this.points[1].toString()},v3=${this.points[2].toString()}]`;
  }
}
// hometask_1