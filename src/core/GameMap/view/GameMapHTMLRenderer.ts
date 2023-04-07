import { gameSounds } from '../../sound/GameSounds';
import { type Emittable, EventEmitter } from '../../utils/event-emitter';
import type { GameMap } from '../model/GameMap';

interface ViewState {
  selectedStructureType: string | null;
}

export class GameMapHTMLRenderer implements Emittable {
  root: HTMLElement;
  state: ViewState = {
    selectedStructureType: null,
  };
  #rendered: boolean = false;

  #ee: EventEmitter;
  on: EventEmitter['on'];
  once: EventEmitter['once'];

  constructor() {
    this.#ee = new EventEmitter();
    this.on = this.#ee.on.bind(this.#ee);
    this.once = this.#ee.once.bind(this.#ee);

    this.#ee.on('tile:click', this.#handleCellClick.bind(this));
  }

  init(mapNode: HTMLElement, map: GameMap): Element {
    if (!mapNode) {
      throw new Error('root element not found');
    }

    this.root = mapNode;
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

      let cellsString = row.reduce((resultStr, tile) => {
        const { coord, field, structure } = tile;
        const { x, y } = coord;

        let cellString = `<div class="tile tile--${field.type}" data-coord-x="${x}" data-coord-y="${y}">`;
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
    mapElement.addEventListener(
      'click',
      this.#handleCellInteraction.bind(this),
    );
    this.root.appendChild(mapElement);
    this.#rendered = true;

    return mapElement;
  }

  selectStructure(factoryType: string | null) {
    if (this.state.selectedStructureType) {
      document.body.classList.remove(
        `factory-type-selected--${this.state.selectedStructureType}`,
      );
    }

    this.state.selectedStructureType = factoryType;
    if (!factoryType) return;
    document.body.classList.add(`factory-type-selected--${factoryType}`);
  }

  #handleCellInteraction(event: Event) {
    if (!event.target) return;
    const tile: HTMLElement = (event.target as HTMLElement).closest('.tile');
    if (!tile) return;

    const target = event.target as HTMLElement;

    const { coordX, coordY } = tile.dataset;

    this.#ee.emit(`tile:${event.type}`, {
      coord: { x: +coordX, y: +coordY },
    });
  }

  #handleCellClick(event) {
    if (!this.state.selectedStructureType) return;

    gameSounds.haptic();

    this.#ee.emit('structure:build', {
      structureType: this.state.selectedStructureType,
      coord: event.coord,
    });
  }

  #getCell(coord) {
    const { x, y } = coord;
    const tile = document.querySelector(
      `[data-coord-x="${x}"][data-coord-y="${y}"]`,
    );
    return tile;
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

    const tile = this.#getCell(coord);
    console.log(tile);
    tile.innerHTML = `<span>${structure.name}</span>`;
  }
}
