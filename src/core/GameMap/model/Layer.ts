import { Plain } from '../../Plain';
import { Vector, type Vertice } from '../../Vector';

export type LayerMap = { [index: number]: string };
export type Layout = number[][];

export class Layer extends Plain {
  map: LayerMap;
  empty: null | any;
  #layout: Layout;

  constructor(size: Vector, map = {}, empty = null) {
    super(size);

    this.empty = empty;
    this.map = map;

    this.#init();
  }

  get layout() {
    return this.#layout;
  }

  hasItem(coord: Vertice) {
    return this.getItem(coord) !== this.empty;
  }

  getItem(coord: Vertice) {
    return this.layout[coord.y]?.[coord.x];
  }

  setItem(coord: Vertice, item: number) {
    const { x, y } = coord;
    this.layout[y][x] = item;
  }

  getAdjacent(coord: Vertice): Vector[] {
    /**
     *  [0,1,2],
     *  [7,x,3],
     *  [6,5,4],
     */
    const adjacentVectors = [
      { x: -1, y: -1 },
      { x: 0, y: -1 },
      { x: 1, y: -1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: -1, y: 1 },
      { x: -1, y: 0 },
    ];
    const v = new Vector(coord);
    const adjacent = adjacentVectors.reduce((acc, vv) => {
      const adj = v.add(vv);
      if (adj.x < 0 || adj.y < 0) {
        return acc;
      }

      return [...acc, adj];
    }, []);
    return adjacent;
  }

  #init() {
    this.#buildLayout();
  }

  #buildLayout() {
    this.#layout = new Array(this.height)
      .fill(null)
      .map(() => new Array(this.width).fill(this.empty));
  }

  toJSON() {
    return {
      size: this.size,
      map: this.map,
      layout: this.layout,
    };
  }
}
