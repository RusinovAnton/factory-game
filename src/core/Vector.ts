export interface Vertice {
  x: number;
  y: number;
}

export class Vector implements Vertice {
  x: number;
  y: number;

  constructor(v: Vertice);
  constructor(x: number, y: number);
  constructor(xv: number | Vertice, y?: number) {
    if (xv instanceof Vector) {
      return xv;
    }

    if (typeof xv === 'number' && typeof y === 'number') {
      this.x = xv;
      this.y = y;

      return this;
    } else {
      const v = xv as Vertice;
      if (typeof v.x === 'number' && typeof v.y === 'number') {
        this.x = v.x;
        this.y = v.y;
        return this;
      }
    }

    throw new TypeError('invalid arguments provided');
  }

  copy() {
    return new Vector(this.x, this.y);
  }

  add(vector: Vertice) {
    const x = vector.x + this.x;
    const y = vector.y + this.y;
    return new Vector(x, y);
  }

  diff(vector: Vertice): Vector {
    const x = vector.x - this.x;
    const y = vector.y - this.y;
    return new Vector(x, y);
  }

  abs(vector: Vertice) {
    return new Vector(Math.abs(vector.x), Math.abs(vector.y));
  }

  toJSON(): Vertice {
    return { x: this.x, y: this.y };
  }
}
