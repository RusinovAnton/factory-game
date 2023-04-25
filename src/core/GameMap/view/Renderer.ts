export abstract class Renderer<T = HTMLElement> {
  root: T;

  constructor(root: T) {
    this.root = root;
  }
}
