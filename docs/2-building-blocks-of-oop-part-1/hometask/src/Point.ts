export interface IPoint {
  x: number;
  y: number
}

export class Point {
  x = 0;
  y = 0;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }

  distance(a?: number | IPoint, b?: number): number {
    let newX = 0;
    let newY = 0;
    if (Number.isInteger(a)) newX = a as number;
    else if (a instanceof Point) {
      newX = a.x;
      newY = a.y;
    }

    if (Number.isInteger(b)) newY = b as number;

    const powX = Math.pow(newX - this.x, 2);
    const powY = Math.pow(newY - this.y, 2);
    return Math.sqrt(powX + powY);
  }
}
// hometask_1