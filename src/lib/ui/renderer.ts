import { gameMapEvents } from '../event-emitter';
import type { GameMap } from '../components/GameMap';

export class HTMLElementRenderer {
  map: GameMap;
  root: HTMLElement;

  constructor(root: HTMLElement | null, map: GameMap) {
    if (!root) {
      throw new Error('root element not found');
    }

    this.root = root;
    this.map = map;
  }

  handleCellInteraction(event: Event) {
    if (!event.target) return;

    // @ts-ignore
    const { coordX, coordY } = event.target.dataset;

    if (!coordX && !coordY) {
      console.log('not a cell');
      return;
    }

    gameMapEvents.emit(event.type, {
      coordX,
      coordY,
      id: `x${coordX}y${coordY}`,
    });
  }

  render(): HTMLElement {
    console.log('Rendering map...');

    this.root.innerHTML = `<div id="${this.map.name}" class="game-map"></div>`;
    const mapElement = document.getElementById(this.map.name);
    if (!mapElement) {
      throw new Error("Couldn't render map div");
    }

    const rows: string = this.map.cells.reduce((resultStr, row) => {
      let rowString = '<div class="row">';

      let cellsString = row.reduce((resultStr, cell) => {
        const { coord, child } = cell;
        const [, x, y] = coord.split(/[xy]/);

        let cellString = `<div class="cell cell--${child.type}" data-coord-x="${x}" data-coord-y="${y}" title="${x} ${y}">`;
        // cellString = cellString + '<div class="structure structure--"></div>';
        cellString = cellString + '</div>';

        return resultStr + cellString;
      }, '');

      rowString = rowString + cellsString;
      rowString = rowString + '</div>';
      return resultStr + rowString;
    }, '');
    mapElement.innerHTML = rows;

    mapElement.addEventListener(
      'mouseover',
      this.handleCellInteraction.bind(this)
    );
    mapElement.addEventListener('click', this.handleCellInteraction.bind(this));

    return mapElement;
  }
}
