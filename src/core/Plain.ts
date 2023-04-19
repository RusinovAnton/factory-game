import type { Vector } from './Vector';

export class Plain {
  size: Vector;
  width: number;
  height: number;

  constructor(size: Vector) {
    const { x, y } = size;

    this.size = size;
    this.width = x;
    this.height = y;
  }

  toJSON() {
    return { size: this.size };
  }
}
