export class Point {
  x: number;
  y: number;

  constructor();
  constructor(x: number, y: number);
  constructor(x?: number, y?: number) {
    this.x = x ?? 0;
    this.y = y ?? 0;
  }

  toString(): string {
    return `(${this.x}, ${this.y})`;
  }

  calculate(x: number, y: number): number {
    return Math.sqrt(Math.pow((x ?? 0) - this.x, 2) + Math.pow((y ?? 0) - this.y, 2));
  }

  distance(): number;
  distance(other: Point): number;
  distance(a: number, b: number): number;
  distance(a?: number | Point, b?: number): number {
    if (a instanceof Point) {
      return this.calculate(a.x, a.y);
    }
    return this.calculate(a, b);
  }
}
