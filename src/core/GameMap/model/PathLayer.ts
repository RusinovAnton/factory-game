import type { Vector } from '../../Vector';
import type { EventEmitter } from '../../utils/event-emitter';
import { Path } from '../model/Path';
import { Layer, type LayerMap } from './Layer';

const pathLayerMap: LayerMap = {
  1: 'belt',
};

export class PathLayer extends Layer {
  #ee: EventEmitter;
  activePath: Path = null;

  constructor(size: Vector, ee: EventEmitter) {
    super(size, pathLayerMap);
    this.#ee = ee;
  }

  startPath(point: Vector) {
    this.activePath = new Path(point);

    this.#ee.emit('path:start', {
      name: 'path:start',
      point,
      path: this.activePath,
    });
  }

  addPathPoint(point: Vector) {
    if (!this.activePath) {
      throw new Error('No path started yet');
    }
    this.activePath.addPoint(point);

    this.#ee.emit('path:add-point', {
      name: 'path:add-point',
      point,
      path: this.activePath,
    });
  }

  commitPath() {
    const path = this.activePath;
    this.activePath = null;
    const startPoint = this.activePath[0];
    const { x, y } = startPoint;
    this.layout[y][x] = path;

    this.#ee.emit('path:commit', { name: 'path:commit', path });

    return path;
  }
}
