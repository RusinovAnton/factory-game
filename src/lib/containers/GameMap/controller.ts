import type { GameMap } from './GameMap';
import type { GameMapHTMLRenderer } from './renderer';
import { Structure } from '../../components/structures/Structure';

export class GameMapController {
  renderer: GameMapHTMLRenderer;
  map: GameMap;
  selectedFactoryType: string | null = null;

  constructor(renderer: GameMapHTMLRenderer) {
    this.renderer = renderer;
    this.map = this.renderer.map;

    this.initialize();
  }

  initialize() {
    this.renderer.render();
    this.renderer.on('click', this.#handleCellClick, this);
    this.renderer.on('mouseover', this.#handleCellMouseOver, this);
  }

  selectStructure(factoryType: string | null) {
    this.selectedFactoryType = factoryType;
    this.renderer.selectFactoryType(factoryType);
    factoryType && console.log(`Selected factory type: ${factoryType}`);
  }

  destroy() {
    throw new Error('destroy method not implemented');
  }

  #handleCellMouseOver() {}

  #handleCellClick(event: any) {
    const { coord, id } = event;
    const factoryType = this.selectedFactoryType;

    if (!factoryType) return;

    const structure = new Structure(factoryType);
    this.map.build(coord, structure);

    this.selectStructure(null);
  }
}
