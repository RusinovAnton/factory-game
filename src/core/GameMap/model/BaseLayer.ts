import { Layer, type LayerMap } from './Layer';

const baseLayerMap: LayerMap = {
  0: 'terrain',
  1: 'water',
};

export class BaseLayer extends Layer {
  constructor(size) {
    super(size, baseLayerMap, 0);
  }
}
