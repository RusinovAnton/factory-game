import type { GameMap } from './components/GameMap';
import { Bank } from './components/structures/Bank';
import { gameMapEvents } from './event-emitter';
import type { HTMLElementRenderer } from './ui/renderer';

export class GameMapController {
  renderer: HTMLElementRenderer;
  map: GameMap;
  selectedFactoryType: string | null = null;

  constructor(renderer: HTMLElementRenderer) {
    this.renderer = renderer;
    this.map = this.renderer.map;

    this.initialize();
  }

  initialize() {
    this.renderer.render();
    gameMapEvents.on('click', this.handleCellClick, this);
    gameMapEvents.on('mouseover', this.handleCellMouseOver, this);
  }

  selectStructure(factoryType: string) {}

  handleCellMouseOver() {}

  handleCellClick(event: any) {
    const { coordX, coordY, id } = event;
    const factoryType = window.___GAME_MAP_STATE.selectedFactoryType;
    const structure = new Bank();
    this.map.build(id, structure);
  }

  destroy() {}
}
