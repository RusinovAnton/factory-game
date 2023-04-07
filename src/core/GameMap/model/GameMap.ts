import { Tile } from '../../Tile';
import { Field } from '../../Field';
import { Plain } from '../../Plain';
import { Structure } from '../../structures/Structure';
import { EventEmitter, type Emittable } from '../../utils/event-emitter';
import { yay } from '../../utils/yay/yay';

type CellsLayout = Array<Array<Tile>>;

export class GameMap extends Plain implements Emittable {
  name: string;
  cells: CellsLayout = [];

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

  init(savedState) {
    console.log('Initializing game map...');

    if (savedState) {
      this.width = savedState.width;
      this.height = savedState.height;
      this.name = savedState.name;
      this.cells = this.buildCells();
    } else {
      this.name = yay();
      this.cells = this.restoreCells(savedStateState.cells);
    }
  }

  build(coord: { x: number; y: number }, structureType: string) {
    const { x, y } = coord;

    // TODO: add canBuild() check

    const structure = new Structure(structureType);
    this.cells[y][x].structure = structure;

    this.#ee.emit('structure:built', { coord, structure });
  }

  toJSON() {
    return {
      name: this.name,
      cells: this.cells,
    };
  }

  private buildCellsLayout() {
    return new Array(this.height)
      .fill(null)
      .map(() => new Array(this.width).fill(null));
  }

  private buildCells() {
    let cellsArray = this.buildCellsLayout();

    return cellsArray.map((row, y) =>
      row.map((_, x) => {
        const tile = new Tile(x, y);
        tile.field = new Field();
        return tile;
      }),
    );
  }

  private restoreCells(savedCells: CellsLayout) {
    let cellsArray = this.buildCellsLayout();

    return cellsArray.map((row, y) =>
      row.map((_, x) => {
        const tile = new Tile(x, y);
        tile.field = new Field();
        return tile;
      }),
    );

    return savedCells;
  }
}
