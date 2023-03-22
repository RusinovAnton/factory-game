import { Plain } from '../Plain';

export class Structure extends Plain {
  name: string;
  level: number = 1;

  constructor(name: string, size: { w: number; h: number } = { w: 1, h: 1 }) {
    const { w, h } = size;
    super(w, h);
    this.name = name;
  }

  upgrade() {
    this.level++;
    return this.level;
  }
}
