import type { Vector } from '../../Vector';
import type { EventEmitter } from '../../utils/event-emitter';
import type { Path } from '../model/Path';
import { Layer, type LayerMap } from './Layer';

const pathLayerMap: LayerMap = {
  1: 'conveyor-belt',
};

export class PathLayer extends Layer {
  #ee: EventEmitter;

  constructor(size: Vector, ee: EventEmitter) {
    super(size, pathLayerMap);
    this.#ee = ee;
  }

  addPath(path: Path) {
    const points = path.everyPoint;
    points.forEach((point) => {
      this.setItem(point, 1);
    });
    console.debug(this.layout);
    this.#ee.emit('path:commit', { name: 'path:commit', path });

    return path;
  }

  checkIntersection(point: Vector, isContinue);
  checkIntersection(points: Vector[], isContinue);
  checkIntersection(points: Vector | Vector[], isContinue = false): boolean {
    const intersects = [].concat(points).reduce((intersects, point, index) => {
      if (intersects) return intersects;
      const hasItem = this.hasItem(point);
      if (isContinue && !index) return false;
      return hasItem;
    }, false);
    return intersects;
  }
}
