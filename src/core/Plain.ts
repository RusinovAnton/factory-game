import type { Vertice } from './Vector';

export abstract class Plain {
  _size: Vertice;
  width: number;
  height: number;

  constructor(size: Vertice) {
    this.size = size;
  }

  get size() {
    return this._size;
  }

  set size(size: Vertice) {
    const { x, y } = size;
    this._size = size;
    this.width = x;
    this.height = y;
  }

  toJSON() {
    return { size: this.size };
  }
}
