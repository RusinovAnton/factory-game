import type { Vertice } from '../../Vector';
import type { EventEmitter } from '../../utils/event-emitter';
import { Path } from '../model/Path';
import { Layer, type LayerMap } from './Layer';

const pathLayerMap: LayerMap = {
  1: 'conveyor-belt',
};

export class PathLayer extends Layer {
  static layerName = 'pathLayer';
  #ee: EventEmitter;
  _pathList: Path[] = [];

  constructor(size: Vertice, ee: EventEmitter) {
    super(PathLayer.layerName, size, pathLayerMap);
    this.#ee = ee;
  }

  addPath(path: Path) {
    if (!this._pathList.includes(path)) {
      this._pathList = [...this._pathList, path];
    }

    const points = path.everyPoint;
    points.forEach((point) => {
      this.setItem(point, 1);
    });
    console.debug(this.layout);
    this.#ee.emit('path:commit', { name: 'path:commit', path });

    return path;
  }

  get pathList(): Path[] {
    return this._pathList;
  }

  set pathList(pathStringList: string[]) {
    this._pathList = pathStringList.map((str) => Path.fromString(str));
  }

  checkIntersection(point: Vertice, isContinue?);
  checkIntersection(points: Vertice[], isContinue?);
  checkIntersection(points: Vertice | Vertice[], isContinue = false): boolean {
    const intersects = [].concat(points).reduce((intersects, point, index) => {
      if (intersects) return intersects;
      const hasItem = this.hasItem(point);
      if (isContinue && !index) return false;
      return hasItem;
    }, false);
    return intersects;
  }

  toJSON() {
    const json = {
      ...super.toJSON(),
      pathList: [],
    };
    json.pathList = this.pathList.map((p) => p.toString());
    return json;
  }
}
