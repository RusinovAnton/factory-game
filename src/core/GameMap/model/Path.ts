import { Vector } from '../../Vector';

export class Path {
  anchors: Vector[] = null;

  constructor(from: Vector, to?: Vector) {
    this.anchors = [];
    this.addPoint(from);
    if (to) {
      this.addPoint(to);
    }
  }

  addPoint(to: Vector) {
    if (this.anchors.length) {
      const from = this.anchors[this.anchors.length - 1];
      const deltaX = to.x - from.x;
      const deltaY = to.y - from.y;

      const isStraight = !deltaX || !deltaY || deltaX === deltaY;

      if (!isStraight) {
        // const max = Math.max(deltaY, deltaX);
        // const min = Math.min(deltaY, deltaX);
        // console.log(min, max);

        const toCenter = Math.floor(deltaX / 2);

        const to1 = new Vector(from.x + toCenter, from.y);
        const to2 = new Vector(from.x + toCenter, to.y);
        this.anchors = this.anchors.concat([to1, to2]);
      }
    }

    this.anchors = this.anchors.concat(to);
    return this;
  }

  toJSON() {
    return this.anchors;
  }
}
