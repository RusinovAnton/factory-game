import type { GameMap } from './model/GameMap';
import type { GameMapHTMLRenderer } from './view/GameMapHTMLRenderer';
import { Structure } from '../structures/Structure';
import { gameStore } from '../storage/Storage';

export class GameMapController {
  view: GameMapHTMLRenderer;
  model: GameMap;

  constructor(model: GameMap, view: GameMapHTMLRenderer) {
    this.view = view;
    this.model = model;
  }

  async init(mapNode) {
    const savedGame = await gameStore.restore();
    this.model.init(savedGame);
    this.view.init(mapNode, this.model);

    this.view.on('structure:build', this.#handleStructureBuild, this);
    this.model.on('structure:built', this.handleBuilding, this);
  }

  selectStructure(factoryType: string | null) {
    this.view.selectStructure(factoryType);
  }

  handleBuilding(event) {
    const { coord, structure } = event;
    this.view.renderStructure(coord, structure);
  }

  #handleStructureBuild(event: any) {
    const { coord, structureType } = event;
    this.model.build(coord, structureType);
    this.selectStructure(null);
  }
}
