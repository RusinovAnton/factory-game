import { Layer, type LayerMap } from './Layer';

const baseLayerMap: LayerMap = {
  0: 'water',
  1: 'terrain',
};

export class BaseLayer extends Layer {
  static layerName = 'baseLayer';

  constructor(size) {
    super(BaseLayer.layerName, size, baseLayerMap, 1);
    return this;
  }
}
