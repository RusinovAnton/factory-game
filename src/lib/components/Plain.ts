export class Plain {
  width: number;
  height: number;

  constructor(w: number = 1, h: number = 1) {
    this.width = w;
    this.height = h;
  }

  get size() {
    return this.width * this.height;
  }
}
