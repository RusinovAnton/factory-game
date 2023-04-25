import { Vector } from '../../Vector';
import type { EventEmitter } from '../../utils/event-emitter';
import { Renderer } from './Renderer';

export class BaseRenderer extends Renderer {
  #ee: EventEmitter;

  constructor(root: HTMLElement, ee) {
    super(root);
    this.#ee = ee;
  }

  render({ name, layout, layoutMap }) {
    const template = document.createElement('template');
    template.innerHTML = `<div id="${name}" class="game-map__root"></div>`;

    // FIXME:
    // @ts-ignore
    const mapElement = template.content.cloneNode(true).firstElementChild;

    if (!mapElement) {
      throw new Error("Couldn't render map div");
    }

    const rows: string = layout.reduce((resultStr, row, y) => {
      let rowString = '<div class="row">';

      const cellsString = row.reduce((resultStr, cell, x) => {
        const cellType = layoutMap[cell];
        let cellString = `<div class="cell cell--${cellType}" data-coord-x="${x}" data-coord-y="${y}">`;
        cellString = cellString + '</div>';

        return resultStr + cellString;
      }, '');

      rowString = rowString + cellsString;
      rowString = rowString + '</div>';
      return resultStr + rowString;
    }, '');
    mapElement.innerHTML = rows;

    mapElement.addEventListener(
      'click',
      this.#handleCellInteraction.bind(this),
    );
    mapElement.addEventListener(
      'mouseover',
      this.#handleCellInteraction.bind(this),
    );

    this.root.appendChild(mapElement);
  }

  #handleCellInteraction(event: Event) {
    if (!event.target) return;
    const cell: HTMLElement = (event.target as HTMLElement).closest('.cell');
    if (!cell) return;

    const { coordX, coordY } = cell.dataset;
    const coord = new Vector(+coordX, +coordY);

    this.#ee.emit(`cell:${event.type}`, {
      coord,
      target: event.target,
      cell,
    });
  }

  // FIXME:
  // getCellNode(coord: Vector) {
  //   const { x, y } = coord;
  //   const cell = document.querySelector(
  //     `[data-coord-x="${x}"][data-coord-y="${y}"]`,
  //   );
  //   return cell;
  // }
}
