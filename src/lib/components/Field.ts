export type FieldT = 'terrain' | 'water';

export class Field {
  type: FieldT;

  constructor(type: FieldT = 'terrain') {
    this.type = type;
  }
}
