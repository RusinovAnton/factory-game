export type Coord = { x: number; y: number };

export class Tile {
  coord: Coord;

  constructor(x: number, y: number) {
    this.coord = { x, y };
  }

  get id() {
    return `x${this.coord.x}y${this.coord.y}`;
  }
}
