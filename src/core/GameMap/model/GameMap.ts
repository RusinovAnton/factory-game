import { Plain } from '../../Plain';
import type { Vertice } from '../../Vector';
import { EventEmitter, type Emitter } from '../../utils/event-emitter';
import { yay } from '../../utils/yay/yay';
import { BaseLayer } from './BaseLayer';
import type { Layer } from './Layer';
import { PathLayer } from './PathLayer';
import { StructureLayer } from './StructureLayer';

const layersMap = {
  [BaseLayer.layerName]: BaseLayer,
  [PathLayer.layerName]: PathLayer,
  [StructureLayer.layerName]: StructureLayer,
};

export class GameMap extends Plain implements Emitter {
  name: string;

  layers: Layer[] = [];
  baseLayer: BaseLayer;
  pathLayer: PathLayer;
  structuresLayer: StructureLayer;

  #ee: EventEmitter;
  on: EventEmitter['on'];
  once: EventEmitter['once'];

  constructor(size: Vertice, saved?) {
    super(size);

    const eventEmitter = new EventEmitter('model:update');
    this.#ee = eventEmitter;
    this.on = this.#ee.on.bind(this.#ee);
    this.once = this.#ee.once.bind(this.#ee);

    if (saved) {
      this.#restoreSavedState(saved);
    } else {
      this.#init();
    }
  }

  // checkIntersection() {}

  #init() {
    console.log('Initializing game map...');

    this.name = yay();

    this.baseLayer = new BaseLayer(this.size);
    this.layers.push(this.baseLayer);

    this.pathLayer = new PathLayer(this.size, this.#ee);
    this.layers.push(this.pathLayer);

    this.structuresLayer = new StructureLayer(this.size);
    this.layers.push(this.structuresLayer);
  }

  #restoreSavedState(savedState) {
    console.log('Restoring saved state');

    const { name, size, layers } = savedState;
    super.size = size;
    this.name = name;
    layers.forEach((l) => {
      const { size, layerName, layout, pathList } = l;
      const LayerClass = layersMap[layerName];
      const layer = new LayerClass(size, layerName ? this.#ee : undefined);
      layer.layout = layout;

      if (layerName === 'pathLayer') {
        (layer as PathLayer).pathList = pathList;
      }

      this[layerName] = layer;
      this.layers.push(layer);
    });
  }

  toJSON() {
    return {
      name: this.name,
      size: this.size,
      layers: this.layers,
    };
  }
}
