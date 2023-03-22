import { type Emittable, EventEmitter } from '../utils/event-emitter';
import type { GameMap } from './model';

export class GameMapHTMLRenderer implements Emittable {
  root: HTMLElement;
  selectedFactoryType: string;
  #rendered: boolean = false;

  #ee: EventEmitter;
  on: EventEmitter['on'];
  once: EventEmitter['once'];

  constructor(root: HTMLElement | null) {
    if (!root) {
      throw new Error('root element not found');
    }

    this.root = root;

    this.#ee = new EventEmitter();
    this.on = this.#ee.on.bind(this.#ee);
    this.once = this.#ee.once.bind(this.#ee);
  }

  handleCellInteraction(event: Event) {
    if (!event.target) return;

    // @ts-ignore
    const { coordX, coordY } = event.target.dataset;

    if (!coordX && !coordY) {
      console.log('not a cell');
      return;
    }

    this.#ee.emit(event.type, {
      coord: { x: +coordX, y: +coordY },
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

  init(map: GameMap): Element {
    console.log('Rendering map...');
    const template = document.createElement('template');
    template.innerHTML = `<div id="${map.name}" class="game-map__root"></div>`;
    // @ts-ignore
    const mapElement = template.content.cloneNode(true).firstElementChild;

    if (!mapElement) {
      throw new Error("Couldn't render map div");
    }

    const rows: string = map.cells.reduce((resultStr, row) => {
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

    // mapElement.addEventListener(
    //   'mouseover',
    //   this.handleCellInteraction.bind(this),
    // );
    mapElement.addEventListener('click', this.handleCellInteraction.bind(this));
    this.root.appendChild(mapElement);
    this.#rendered = true;

    return mapElement;
  }

  renderStructure(coord, structure) {
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
