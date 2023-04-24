import randomColor from 'randomcolor';
import { Vector, type Vertice } from '../../Vector';
import { EventEmitter, type Emittable } from '../../utils/event-emitter';
import type { Layout } from '../model/Layer';

type Props = {
  name: string;
  layout: Layout;
};

const SPRITE_PATH_COLOR = 'rgba(0, 100, 200, 0.4)';
const INVALID_SPRITE_PATH_COLOR = 'rgba(250, 50, 0, 0.4)';

const svgRoot = document.getElementById('svg-layers');
const pathLayerNode = document.getElementById('path-layer');
const structuresLayerNode = document.getElementById('structure-layer');
const resourcesLayerNode = document.getElementById('resources-layer');
const spriteLayerNode = document.getElementById('sprite-layer');

function setElementAttributes(element, attributes) {
  Object.entries(attributes).forEach(([key, value]) =>
    element.setAttribute(key, value),
  );
}

function createSVGElement(tagName, attributes = {}) {
  const element = document.createElementNS(
    'http://www.w3.org/2000/svg',
    tagName,
  );

  setElementAttributes(element, attributes);

  return element;
}

function detectCollision(a, b) {
  const HITBOX_COEFFICIENT = 0.7;
  return (
    a.x + a.width * HITBOX_COEFFICIENT > b.x &&
    a.x < b.x + b.width * HITBOX_COEFFICIENT &&
    a.y + a.height * HITBOX_COEFFICIENT > b.y &&
    a.y < b.y + b.height * HITBOX_COEFFICIENT
  );
}

export class GameMapHTMLRenderer implements Emittable {
  root: HTMLElement;
  size: Vector;
  props: Props;

  #ee: EventEmitter;
  on: EventEmitter['on'];
  once: EventEmitter['once'];

  rendered: boolean = false;

  constructor(root: HTMLElement, size: Vector, props: Props) {
    this.size = size;
    this.root = root;
    this.props = props;

    const ee = new EventEmitter('view:event');
    this.#ee = ee;
    this.on = this.#ee.on.bind(this.#ee);
    this.once = this.#ee.once.bind(this.#ee);

    this.#init();
  }

  #init() {
    const root = this.root;
    if (!root) {
      throw new Error('root element not found');
    }

    svgRoot.setAttribute('viewBox', `0 0 ${this.size.x} ${this.size.y}`);

    console.log('Rendering map...');

    this.#renderMap();
    this.rendered = true;

    console.log('Renderer initialized...');
  }

  #renderMap() {
    const { name, layout } = this.props;
    const template = document.createElement('template');
    template.innerHTML = `<div id="${name}" class="game-map__root"></div>`;
    // FIXME:
    // @ts-ignore
    const mapElement = template.content.cloneNode(true).firstElementChild;

    if (!mapElement) {
      throw new Error("Couldn't render map div");
    }

    const rows: string = layout.reduce((resultStr, row, y) => {
      let rowString = '<div class="row">';

      let cellsString = row.reduce((resultStr, cell, x) => {
        // FIXME: Hardcoded! Use layer map to translate layout
        let cellString = `<div class="cell cell--terrain" data-coord-x="${x}" data-coord-y="${y}">`;
        cellString = cellString + '</div>';

        return resultStr + cellString;
      }, '');

      rowString = rowString + cellsString;
      rowString = rowString + '</div>';
      return resultStr + rowString;
    }, '');
    mapElement.innerHTML = rows;

    mapElement.addEventListener(
      'click',
      this.#handleCellInteraction.bind(this),
    );
    mapElement.addEventListener(
      'mouseover',
      this.#handleCellInteraction.bind(this),
    );

    this.root.appendChild(mapElement);
  }

  #handleCellInteraction(event: Event) {
    if (!event.target) return;
    const cell: HTMLElement = (event.target as HTMLElement).closest('.cell');
    if (!cell) return;

    const { coordX, coordY } = cell.dataset;
    const coord = new Vector(+coordX, +coordY);

    this.#ee.emit(`cell:${event.type}`, {
      coord,
      target: event.target,
      cell,
    });
  }

  getCellNode(coord: Vector) {
    const { x, y } = coord;
    const cell = document.querySelector(
      `[data-coord-x="${x}"][data-coord-y="${y}"]`,
    );
    return cell;
  }

  getCellSize() {
    const cellNode = this.getCellNode(new Vector(0, 0));
    const rect = cellNode.getBoundingClientRect();
    const { width, height } = rect;
    return new Vector(width, height);
  }

  getCellCenter(coord: Vector): Vector {
    const { x, y } = this.getCellSize();
    const width = Math.round(x);
    const height = Math.round(y);
    const center = new Vector(
      Math.floor(width / 2 + coord.x * width),
      Math.floor(height / 2 + coord.y * height),
    );
    return center;
  }

  //  FIXME: move to StructureLayer
  // renderStructure(coord, structure) {
  //   console.debug(
  //     'Rendering built structure: ',
  //     structure.name,
  //     ' at x: ',
  //     coord.x,
  //     'y: ',
  //     coord.y,
  //   );

  //   const cell = this.getCellNode(coord);
  //   console.debug(cell);
  //   cell.innerHTML = `<span>${structure.name}</span>`;
  // }

  // selectStructure(factoryType: string | null) {
  //   if (this.state.selectedStructureType) {
  //     document.body.classList.remove(
  //       `factory-type-selected--${this.state.selectedStructureType}`,
  //     );
  //   }

  //   this.state.selectedStructureType = factoryType;
  //   if (!factoryType) return;
  //   document.body.classList.add(`factory-type-selected--${factoryType}`);
  // }

  activePathNode = null;
  spritePathNode = document.getElementById('sprite-path');

  pathToString(pathAnchors: Vector[]): string {
    const cellSize = this.getCellSize().x;
    const pathString = pathAnchors.reduce((str, point: Vector, index) => {
      const command = index === 0 ? 'M' : 'L';
      const { x, y } = point;

      const toX = x + 0.5;
      const toY = y + 0.5;

      return `${str}${command} ${toX} ${toY} `;
    }, '');

    return pathString;
  }

  drawPath(pathAnchors: Vector[], startPath: boolean = false) {
    const PATH_WIDTH = 0.7;

    if (startPath) {
      this.activePathNode = createSVGElement('path', {
        id: `path-${pathAnchors[0].x}-${pathAnchors[0].y}`,
        fill: 'none',
        'stroke-width': PATH_WIDTH,
        stroke: randomColor(),
      });

      pathLayerNode.appendChild(this.activePathNode);
      document.addEventListener('contextmenu', this.commitPath);
    }

    const pathString = this.pathToString(pathAnchors);
    requestAnimationFrame(() => {
      this.activePathNode.setAttribute('d', pathString);
    });
  }

  drawSprite(anchors: Vector[], valid = true) {
    if (!this.spritePathNode) {
      this.spritePathNode = createSVGElement('path', {
        fill: 'none',
        'stroke-width': 0.5,
      });

      spriteLayerNode.appendChild(this.spritePathNode);
    }

    // FIXME: performance?
    this.spritePathNode.setAttribute(
      'stroke',
      valid ? SPRITE_PATH_COLOR : INVALID_SPRITE_PATH_COLOR,
    );

    const pathString = this.pathToString(anchors);

    requestAnimationFrame(() => {
      this.spritePathNode.setAttribute('d', pathString);
    });
  }

  commitPath = (event) => {
    event.preventDefault();
    const pathNode = this.activePathNode;
    // FIXME:
    this.moveResourcesAlongPath(pathNode);
    this.#ee.emit('path:commit', { target: pathNode });
    this.spritePathNode.setAttribute('d', '');
    this.spritePathNode.setAttribute('stroke', '');

    document.removeEventListener('contextmenu', this.commitPath);
  };

  pathResources = [];

  emitResource(start: Vertice) {
    const distance = 0;

    const RESOURCE_ITEM_COLOR = '#031450';
    const RESOURCE_ITEM_SIZE = 0.3;
    const ball = createSVGElement('circle', {
      fill: RESOURCE_ITEM_COLOR,
      r: RESOURCE_ITEM_SIZE,
      cx: start.x,
      cy: start.y,
    });

    const resourceItem = {
      index: 0,
      element: ball,
      distance,
    };

    const length = this.pathResources.push(resourceItem);
    resourceItem.index = length - 1;

    requestAnimationFrame(() => {
      resourcesLayerNode.appendChild(ball);
    });

    return resourceItem;
  }

  emitIntervalId = null;

  // TODO:
  // This is a prototype func
  moveResourcesAlongPath(path: SVGPathElement) {
    this.pathResources = [];
    const pathLength = path.getTotalLength();
    const BELT_SPEED = 0.08;
    const EMIT_SPEED = 200;
    const CONSUME_SPEED = 300;

    const start = path.getPointAtLength(0);

    this.emitIntervalId = setInterval(() => {
      if (this.pathResources.length > pathLength) {
        clearInterval(this.emitIntervalId);
        return;
      }
      const item = this.emitResource(start);
      requestAnimationFrame(() => animate(item));
    }, EMIT_SPEED);

    const animate = (item) => {
      const nextIndex = item.index - 1;
      const nextItem = this.pathResources[nextIndex];

      if (nextItem) {
        const nextRect = nextItem.element.getBoundingClientRect();
        const rect = item.element.getBoundingClientRect();
        const collide = detectCollision(rect, nextRect);

        if (collide) {
          requestAnimationFrame(() => animate(item));
          return;
        }
      }

      item.distance += BELT_SPEED;
      if (item.distance >= pathLength) {
        setTimeout(() => {
          item.element.remove();
        }, CONSUME_SPEED);
        return;
      }
      const position = path.getPointAtLength(item.distance);

      item.element.setAttribute('cx', position.x);
      item.element.setAttribute('cy', position.y);
      requestAnimationFrame(() => animate(item));
    };
  }

  cancelLastPath() {
    this.activePathNode.remove();
    this.activePathNode = null;
  }

  renderStructure(coord: Vector, structure) {
    const p1 = coord;
    const p2 = coord.add(new Vector(1, 1));
    const p3 = coord.add(new Vector(0, 1));

    const points: string = [p1, p2, p3].reduce(
      (str, point) => `${str} ${point.x},${point.y}`,
      '',
    );

    const polygon = createSVGElement('polygon', {
      points,
      fill: randomColor(),
    });

    structuresLayerNode.appendChild(polygon);
  }
}
