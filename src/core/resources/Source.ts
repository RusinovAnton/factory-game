import { Plain } from '../Plain';
import {
  Resource,
  createCopper,
  createIron,
  createWolframite,
  createWood,
} from './Resource';
import { createCoal } from './Resource';

export class Source extends Plain {
  resource: Resource;
  name: string;

  constructor(resource: Resource) {
    super();
    const name = `${resource.type}-source`;
    this.name = name;
    this.resource = resource;
  }
}

export function createSource(resource: Resource) {
  return new Source(resource);
}

export function createCoalSource() {
  const resource = createCoal();
  return createSource(resource);
}

export function createCopperSource() {
  const resource = createCopper();
  return createSource(resource);
}

export function createIronSource() {
  const resource = createIron();
  return createSource(resource);
}

export function createWolframiteSource() {
  const resource = createWolframite();
  return createSource(resource);
}

export function createWoodSource() {
  const resource = createWood();
  return createSource(resource);
}
