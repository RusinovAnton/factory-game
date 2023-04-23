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
      const dx = to.x - from.x;
      const dy = to.y - from.y;

      const isStraight = !dx || !dy || Math.abs(dx) === Math.abs(dy);

      if (!isStraight) {
        console.debug('Deltas: ', dx, dy);
        if (Math.abs(Math.abs(dx) - Math.abs(dy)) < 5) {
          // Draw diagonal + horizontal

          // FIXME: works for positive vibes only
          if (dx > dy) {
            this.anchors = this.anchors.concat(
              new Vector(from.x + dy, from.y + dy),
            );
          } else {
            this.anchors = this.anchors.concat(
              new Vector(from.x + dx, from.y + dx),
            );
          }
        } else {
          // Draw 2 horizontal + vertical
          const toCenter = Math.floor(dx / 2);

          const to1 = new Vector(from.x + toCenter, from.y);
          const to2 = new Vector(from.x + toCenter, to.y);
          this.anchors = this.anchors.concat([to1, to2]);
        }
      }
    }

    this.anchors = this.anchors.concat(to);
    return this;
  }

  get everyPoint() {
    const path = this.anchors;
    const points = [path[0]];

    for (let i = 0; i < path.length - 1; i++) {
      const { x: x1, y: y1 } = path[i];
      const { x: x2, y: y2 } = path[i + 1];

      const dx = x2 - x1;
      const dy = y2 - y1;
      const numSteps = Math.max(Math.abs(dx), Math.abs(dy));

      for (let j = 1; j <= numSteps; j++) {
        const x = x1 + Math.round((dx / numSteps) * j);
        const y = y1 + Math.round((dy / numSteps) * j);
        points.push(new Vector(x, y));
      }
    }

    return points;
  }

  static delta(from: Vector, to: Vector): Vector {
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    return new Vector(dx, dy);
  }

  toJSON() {
    return this.anchors;
  }
}
