export type ResourceType = 'coal' | 'copper' | 'iron' | 'wolframite' | 'wood';

export interface ResourceT<T> {
  type: T;
  cost: number;
}

export class Resource implements ResourceT<ResourceType> {
  type: ResourceType;
  cost: number;

  constructor(type: ResourceType, cost = 0) {
    this.type = type;
    this.cost = cost;
  }
}

export function createResource(type: ResourceType, cost) {
  return new Resource(type, cost);
}

export function createCoal() {
  return createResource('coal', 10);
}

export function createCopper() {
  return createResource('copper', 10);
}

export function createIron() {
  return createResource('iron', 10);
}

export function createWolframite() {
  return createResource('wolframite', 10);
}

export function createWood() {
  return createResource('wood', 10);
}
