import { Plain } from '../../Plain';
import type { Vector } from '../../Vector';
import { EventEmitter, type Emittable } from '../../utils/event-emitter';
import { yay } from '../../utils/yay/yay';
import { Layer } from './Layer';
import { PathLayer } from './PathLayer';

const savedState = null;

export class GameMap extends Plain implements Emittable {
  name: string;
  layers: Layer[] = [];
  pathLayer: PathLayer;
  baseLayer: Layer;

  #ee: EventEmitter;
  on: EventEmitter['on'];
  once: EventEmitter['once'];

  constructor(size: Vector) {
    super(size);

    const eventEmitter = new EventEmitter('model:update');
    this.#ee = eventEmitter;
    this.on = this.#ee.on.bind(this.#ee);
    this.once = this.#ee.once.bind(this.#ee);

    this.baseLayer = new Layer(size);
    this.pathLayer = new PathLayer(size, eventEmitter);
    this.layers.push(this.baseLayer);
    this.layers.push(this.pathLayer);

    this.#init();
  }

  #init() {
    console.log('Initializing game map...');

    if (savedState) {
      this.#restoreSavedState();
    } else {
      this.name = yay();
    }
  }

  #restoreSavedState() {
    const { name, width, height, layers } = savedState;
    this.width = savedState.width;
    this.height = savedState.height;
    this.name = savedState.name;
    this.layers = [];
  }

  build(coord: { x: number; y: number }, structureType: string) {}

  toJSON() {
    return {
      name: this.name,
      size: this.size,
      layers: this.layers,
    };
  }
}
