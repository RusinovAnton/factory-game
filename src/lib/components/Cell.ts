import type { Field } from './Field';

export class Cell {
  coord: string;
  child: Field;

  constructor(coord: string, child: Field) {
    this.coord = coord;
    this.child = child;
  }
}
