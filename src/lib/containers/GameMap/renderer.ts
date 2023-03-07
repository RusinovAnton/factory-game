import { EventEmitter, type EmitterClass } from '../../utils/event-emitter';
import type { GameMap } from './GameMap';

export class GameMapHTMLRenderer implements EmitterClass {
  map: GameMap;
  root: HTMLElement;
  selectedFactoryType: string;
  #rendered: boolean = false;
  #events: EventEmitter;

  constructor(root: HTMLElement | null, map: GameMap) {
    if (!root) {
      throw new Error('root element not found');
    }

    this.root = root;
    this.map = map;
    this.#events = new EventEmitter();
    this.map.on('build', this.renderBuiltStructure);
  }

  on(e, fn, c?) {
    return this.#events.on(e, fn, c);
  }

  once(e, fn, c?) {
    return this.#events.once(e, fn, c);
  }

  handleCellInteraction(event: Event) {
    if (!event.target) return;

    // @ts-ignore
    const { coordX, coordY } = event.target.dataset;

    if (!coordX && !coordY) {
      console.log('not a cell');
      return;
    }

    this.#events.emit(event.type, {
      coord: { x: coordX, y: coordY },
    });
  }

  selectFactoryType(factoryType: string) {
    document.body.classList.remove(
      `factory-type-selected--${this.selectedFactoryType}`,
    );
    this.selectedFactoryType = factoryType;

    if (!factoryType) return;

    document.body.classList.add(`factory-type-selected--${factoryType}`);
  }

  render(): Element {
    console.log('Rendering map...');
    const template = document.createElement('template');
    template.innerHTML = `<div id="${this.map.name}" class="game-map__root"></div>`;
    // @ts-ignore
    const mapElement = template.content.cloneNode(true).firstElementChild;

    if (!mapElement) {
      throw new Error("Couldn't render map div");
    }

    const rows: string = this.map.cells.reduce((resultStr, row) => {
      let rowString = '<div class="row">';

      let cellsString = row.reduce((resultStr, cell) => {
        const { coord, field, structure } = cell;
        const { x, y } = coord;

        let cellString = `<div class="cell cell--${field.type}" data-coord-x="${x}" data-coord-y="${y}">`;
        if (structure) {
          cellString =
            cellString +
            `<div class="structure structure--${structure.name}"></div>`;
        }
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
      this.handleCellInteraction.bind(this),
    );
    mapElement.addEventListener('click', this.handleCellInteraction.bind(this));
    this.root.appendChild(mapElement);
    this.#rendered = true;

    return mapElement;
  }

  renderBuiltStructure(event) {
    const { coord, structure } = event;
    console.log(
      'Rendering built structure: ',
      structure.name,
      ' at x: ',
      coord.x,
      'y: ',
      coord.y,
    );
  }
}
