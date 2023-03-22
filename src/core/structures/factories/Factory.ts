import { Structure } from '../Structure';

export class Factory extends Structure {
  availableProducts: [] = [];
  activeProduction: any = 'computer';

  constructor(name: string) {
    super(name);
  }
}
