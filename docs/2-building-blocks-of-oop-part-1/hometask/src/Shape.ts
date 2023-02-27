import { Point } from "./point";

export abstract class Shape {
  protected color: string;
  protected filled: boolean;
  points: Point[];

  constructor(points: Point[], color?: string, isFilled?: boolean) {
    if (points && points.length < 3) {
      throw new Error('A shape must have at least 3 points');
    }

    this.color = color ?? 'green';
    this.filled = isFilled ?? true;
    this.points = points;
  }

  abstract getType(): string;

  toString() {
    const pointsString = this.points.map(item => `(${item.x}, ${item.y})`).join(', ');
    const filledString = this.filled ? 'filled' : 'not filled';
    return `A Shape with color of ${this.color} and ${filledString}. Points: ${pointsString}.`;
  }

  getPerimeter() {
    let total = 0;
    this.points.map((item, index) => {
      const isLast = this.points.length - 1 === index;
      total += item.distance(this.points[!isLast ? index + 1 : 0]);
    });
    return total;
  }
}
// hometask_1