import { Plain } from '../../Plain';
import type { Vector } from '../../Vector';

export type LayerMap = { [index: number]: string };
export type Layout = number[][];

export class Layer extends Plain {
  map: LayerMap;
  fill: any;
  layout: Layout;

  constructor(size: Vector, map = {}, fill = null) {
    super(size);

    this.fill = fill;
    this.map = map;

    this.#init();
  }

  #init() {
    this.#buildLayout();
  }

  #buildLayout() {
    this.layout = new Array(this.height)
      .fill(null)
      .map(() => new Array(this.width).fill(this.fill));
  }

  toJSON() {
    return {
      map: this.map,
      layout: this.layout,
    };
  }
}
