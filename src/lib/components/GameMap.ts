import { yay } from '../utils/yay/yay';
import { Field } from './Field';
import { Plain } from './Plain';
import { Cell } from './Cell';
import type { Structure } from './structures/Structure';

export class GameMap extends Plain {
  name: string;
  cells: Array<Array<Cell>> = [];

  constructor(w: number, h: number) {
    super(w, h);

    this.name = yay();
    this.initialize();
  }

  private initialize() {
    console.log('Initializing game map...');

    for (let y = 0; y < this.height; y++) {
      this.cells = [...this.cells, []];

      for (let x = 0; x < this.width; x++) {
        const coord = `x${x}y${y}`;
        const field = new Field();
        const cell = new Cell(coord, field);
        this.cells[y] = [...this.cells[y], cell];
      }
    }
  }

  build(coord: string, structure: Structure) {
    console.log(`Building ${structure.name} at ${coord}`);
  }
}
