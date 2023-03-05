import type { GameMap } from './components/GameMap';
import { Bank } from './components/structures/Bank';
import { gameMapEvents } from './event-emitter';
import { HTMLElementRenderer } from './ui/renderer';

export class GameMapController {
  renderer: HTMLElementRenderer;
  map: GameMap;

  constructor(map: GameMap) {
    this.renderer = new HTMLElementRenderer(
      document.getElementById('root'),
      map
    );
    this.renderer.render();
    this.map = map;

    gameMapEvents.on('click', this.handleCellClick, this);
    gameMapEvents.on('mouseover', this.handleCellMouseOver, this);
  }

  handleCellMouseOver() {}

  handleCellClick(event: any) {
    const { coordX, coordY, id } = event;
    const factoryType = window.___GAME_MAP_STATE.selectedFactoryType;
    const structure = new Bank();
    this.map.build(id, structure);
  }

  destroy() {}
}
