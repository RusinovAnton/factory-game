export class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Vector(this.x, this.y);
  }

  add(vector: Vector) {
    const x = vector.x + this.x;
    const y = vector.y + this.y;
    return new Vector(x, y);
  }

  diff(vector: Vector): Vector {
    const x = vector.x - this.x;
    const y = vector.y - this.y;
    return new Vector(x, y);
  }

  toJSON() {
    return { x: this.x, y: this.y };
  }
}
