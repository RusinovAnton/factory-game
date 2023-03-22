import { Cell } from '../Cell';
import { Field } from '../Field';
import { Plain } from '../Plain';
import type { Structure } from '../structures/Structure';
import { EventEmitter, type Emittable } from '../utils/event-emitter';
import { yay } from '../utils/yay/yay';

export class GameMap extends Plain implements Emittable {
  name: string;
  cells: Array<Array<Cell>> = [];

  #ee: EventEmitter;
  on: EventEmitter['on'];
  once: EventEmitter['once'];

  constructor(w: number, h: number) {
    super(w, h);
    this.width = w;
    this.height = h;

    this.#ee = new EventEmitter();
    this.on = this.#ee.on.bind(this.#ee);
    this.once = this.#ee.once.bind(this.#ee);
  }

  init() {
    console.log('Initializing game map...');

    this.name = yay();

    this.cells = this.buildCells();
  }

  private buildCells() {
    let cellsArray = new Array(this.height)
      .fill(null)
      .map(() => new Array(this.width).fill(null));

    return cellsArray.map((row, y) =>
      row.map((_, x) => {
        const cell = new Cell(x, y);
        cell.field = new Field();
        return cell;
      }),
    );
  }

  build(coord: { x: number; y: number }, structure: Structure) {
    const { x, y } = coord;
    // FIXME: add canBuild() check
    this.cells[y][x].structure = structure;

    console.log('building at: ', x, ' ', y);

    this.#ee.emit('build', { coord, structure });
  }

  toJSON() {
    return {
      name: this.name,
      cells: this.cells,
    };
  }
}
