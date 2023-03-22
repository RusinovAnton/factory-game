import { Structure } from './Structure';

export class ConveyorBelt extends Structure {
  TRANSPORTATION_COF = 3;

  constructor() {
    super('belt');
  }

  get capacity() {
    return this.level * this.TRANSPORTATION_COF;
  }
}
