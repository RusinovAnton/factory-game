import { Structure } from './Structure';

type ResourceType = 'coal' | 'iron' | 'copper' | 'wolframite';

export class Mine extends Structure {
  // FIXME
  resourceType: ResourceType;
  // Items per minute
  extractionRate: number;

  constructor(resourceType: ResourceType) {
    const name = `${resourceType}-mine`;
    super(name);

    this.resourceType = resourceType;
    // FIXME:
    this.extractionRate = 1;
  }
}
