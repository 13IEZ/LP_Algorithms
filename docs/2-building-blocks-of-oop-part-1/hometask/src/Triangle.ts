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
    if (side1.toFixed(1) === side2.toFixed(1) && side2.toFixed(1) === side3.toFixed(1)) {
      return "equilateral triangle";
    }
    if (side1 === side2 || side1 === side3 || side2 === side3) {
      return "isosceles triangle";
    }
    return "scalene triangle";
  }

  toString(): string {
    return `Triangle[v1=${this.points[0].toString()},v2=${this.points[1].toString()},v3=${this.points[2].toString()}]`;
  }
}
