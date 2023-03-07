import { Cell } from '../../components/Cell';
import { Field } from '../../components/Field';
import { Plain } from '../../components/Plain';
import type { Structure } from '../../components/structures/Structure';
import { EventEmitter, type EmitterClass } from '../../utils/event-emitter';
import { yay } from '../../utils/yay/yay';

export class GameMap extends Plain implements EmitterClass {
  cells: Array<Array<Cell>> = [];
  name: string;
  #events: EventEmitter;

  constructor(w: number, h: number) {
    super(w, h);
    this.name = yay();
    this.initialize();
    this.#events = new EventEmitter();
  }

  private initialize() {
    console.log('Initializing game map...');

    let cellsArray = new Array(this.height)
      .fill(null)
      .map(() => new Array(this.width).fill(null));

    this.cells = cellsArray.map((row, y) =>
      row.map((_, x) => {
        const cell = new Cell(x, y);
        cell.field = new Field();
        return cell;
      }),
    );
  }

  on(e, fn, c?) {
    return this.#events.on(e, fn, c);
  }

  once(e, fn, c?) {
    return this.#events.once(e, fn, c);
  }

  build(coord: { x: number; y: number }, structure: Structure) {
    const { x, y } = coord;
    // FIXME: add canBuild() check
    this.cells[y][x].structure = structure;

    this.#events.emit('build', { coord, structure });
  }

  toJSON() {
    return {
      name: this.name,
      cells: this.cells,
    };
  }
}
