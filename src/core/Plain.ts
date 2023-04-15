import type { Vector } from './Vector';

export class Plain {
  width: number;
  height: number;
  size: Vector;

  constructor(size: Vector) {
    const { x: w, y: h } = size;
    this.width = w;
    this.height = h;
    this.size = size;
  }
}
