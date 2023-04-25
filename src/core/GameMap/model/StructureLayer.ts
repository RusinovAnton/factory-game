import { Layer } from './Layer';

const structuresMap = {};

export class StructureLayer extends Layer {
  static layerName = 'structureLayer';

  constructor(size) {
    super(StructureLayer.layerName, size, structuresMap);
  }
}
