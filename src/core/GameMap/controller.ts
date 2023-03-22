import type { GameMap } from './model';
import type { GameMapHTMLRenderer } from './view';
import { Structure } from '../structures/Structure';

export class GameMapController {
  view: GameMapHTMLRenderer;
  model: GameMap;
  state: {
    selectedFactoryType: string | null;
  } = { selectedFactoryType: null };

  constructor(model: GameMap, view: GameMapHTMLRenderer) {
    this.view = view;
    this.model = model;
  }

  init() {
    this.model.init();
    this.view.init(this.model);

    this.view.on('click', this.#handleCellClick, this);
    // this.view.on('mouseover', this.#handleCellMouseOver, this);

    this.model.on('build', this.handleBuilding, this);
  }

  destroy() {
    throw new Error('destroy method not implemented');
  }

  selectStructure(factoryType: string | null) {
    this.state.selectedFactoryType = factoryType;
    this.view.selectFactoryType(factoryType);
    factoryType && console.log(`Selected factory type: ${factoryType}`);
  }

  handleBuilding(event) {
    this.view.renderStructure(event.coord, event.structure);
  }

  #handleCellClick(event: any) {
    const factoryType = this.state.selectedFactoryType;
    if (!factoryType) return;

    const { coord, id } = event;
    const structure = new Structure(factoryType);
    this.model.build(coord, structure);

    this.selectStructure(null);
  }
}
