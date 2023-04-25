import type { Vertice } from '../../Vector';
import { EventEmitter, type Emitter } from '../../utils/event-emitter';
import type { Layer, Layout } from '../model/Layer';
import { BaseRenderer } from './BaseRenderer';
import { PathRenderer } from './PathRenderer';
import { ResourcesRenderer } from './ResourcesRenderer';
import { StructureRenderer } from './StructureRenderer';

type Props = {
  name: string;
  layout: Layout;
  layoutMap: Layer['map'];
  pathList: Path[];
};

interface Path {
  anchors: Vertice[];
}

const svgRoot = document.getElementById('svg-layers') as unknown as SVGElement;
const pathLayerNode = document.getElementById(
  'path-layer',
) as unknown as SVGElement;
const structuresLayerNode = document.getElementById(
  'structure-layer',
) as unknown as SVGElement;
const resourcesLayerNode = document.getElementById(
  'resources-layer',
) as unknown as SVGElement;
const foregroundLayerNode = document.getElementById(
  'foreground-layer',
) as unknown as SVGElement;

export class GameMapHTMLRenderer implements Emitter {
  size: Vertice;

  root: HTMLElement;
  grid: BaseRenderer;
  paths: PathRenderer;
  structures: StructureRenderer;
  resources: ResourcesRenderer;

  #ee: EventEmitter;
  on: EventEmitter['on'];
  once: EventEmitter['once'];

  rendered = false;

  constructor(root: HTMLElement, size: Vertice) {
    this.size = size;
    this.root = root;

    const ee = new EventEmitter('view:event');
    this.#ee = ee;
    this.on = this.#ee.on.bind(this.#ee);
    this.once = this.#ee.once.bind(this.#ee);

    this.grid = new BaseRenderer(this.root, ee);
    this.paths = new PathRenderer(pathLayerNode, foregroundLayerNode, ee);
    this.structures = new StructureRenderer(structuresLayerNode);
    this.resources = new ResourcesRenderer(resourcesLayerNode);

    this.#init();
  }

  #init() {
    if (!this.root) {
      throw new Error('root element not found');
    }
    svgRoot.setAttribute('viewBox', `0 0 ${this.size.x} ${this.size.y}`);

    this.#ee.on(
      'path:commit',
      this.resources.moveResourcesAlongPath,
      this.resources,
    );

    console.log('Renderer initialized...');
  }

  render(props: Props) {
    if (this.rendered) return;

    console.log('Rendering map...');

    const { name, layout, layoutMap, pathList } = props;

    this.grid.render({ name, layout, layoutMap });

    pathList.forEach((path) => {
      this.paths.drawPath(path.anchors);
    });

    this.rendered = true;
  }
}
