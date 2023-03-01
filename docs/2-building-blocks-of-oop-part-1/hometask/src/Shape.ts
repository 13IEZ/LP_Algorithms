import { Point } from "./point";

export abstract class Shape {
  protected color: string;
  protected filled: boolean;
  points: Point[];

  constructor(points: Point[]);
  constructor(points: Point[], color: string, isFilled: boolean);
  constructor(points: Point[], color?: string, isFilled?: boolean) {
    if (points?.length < 3) {
      throw new Error('A shape must have at least 3 points');
    }

    this.color = color ?? 'green';
    this.filled = isFilled ?? true;
    this.points = points;
  }

  abstract getType(): string;

  toString(): string {
    const pointsString = this.points.map(item => `(${item.x}, ${item.y})`).join(', ');
    const filledString = this.filled ? 'filled' : 'not filled';
    return `A Shape with color of ${this.color} and ${filledString}. Points: ${pointsString}.`;
  }

  getPerimeter(): number {
    return this.points.reduce((accumulator: number, item: Point, index: number) => {
      const isLast = this.points.length - 1 === index;
      return accumulator + item.distance(this.points[!isLast ? index + 1 : 0]);
    }, 0);
  }
}
