import type { Vector } from '../../Vector';

export class Path {
  anchors: Vector[] = null;

  constructor(startPoint: Vector) {
    this.anchors = [];
    this.addPoint(startPoint);
  }

  addPoint(point: Vector) {
    this.anchors = this.anchors.concat(point);
    return this;
  }

  toJSON() {
    return this.anchors;
  }
}
