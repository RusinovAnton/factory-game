import type { Field } from './Field';
import type { Structure } from './structures/Structure';

export type Coord = { x: number; y: number };

export class Cell {
  coord: Coord;
  #field: Field;
  #structure: Structure;

  constructor(x: number, y: number) {
    this.coord = { x, y };
  }

  get id() {
    return `x${this.coord.x}y${this.coord.y}`;
  }

  get field() {
    return this.#field;
  }

  set field(field: Field) {
    this.#field = field;
  }

  get structure() {
    return this.#structure;
  }

  set structure(structure: Structure) {
    this.#structure = structure;
  }
}
