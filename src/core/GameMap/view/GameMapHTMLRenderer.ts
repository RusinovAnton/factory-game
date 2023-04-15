import randomColor from 'randomcolor';
import { Vector } from '../../Vector';
import { EventEmitter, type Emittable } from '../../utils/event-emitter';
import type { Layout } from '../model/Layer';

type Props = {
  name: string;
  layout: Layout;
};

const SPRITE_PATH_COLOR = 'rgba(0, 100, 200, 0.4)';

const svgRoot = document.getElementById('svg-layers');
const pathLayerNode = document.getElementById('path-layer');
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
  //   console.log(
  //     'Rendering built structure: ',
  //     structure.name,
  //     ' at x: ',
  //     coord.x,
  //     'y: ',
  //     coord.y,
  //   );

  //   const cell = this.getCellNode(coord);
  //   console.log(cell);
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

  drawPath(pathAnchors: Vector[]) {
    if (!this.activePathNode) {
      this.activePathNode = createSVGElement('path', {
        fill: 'none',
        'stroke-width': 0.5,
        stroke: randomColor(),
      });

      pathLayerNode.appendChild(this.activePathNode);
      document.addEventListener('contextmenu', this.commitPath);
    }

    console.log('drawing path: ', pathAnchors);

    const pathString = this.pathToString(pathAnchors);
    requestAnimationFrame(() => {
      this.activePathNode.setAttribute('d', pathString);
    });
  }

  drawSprite(from: Vector, to: Vector) {
    if (!this.spritePathNode) {
      this.spritePathNode = createSVGElement('path', {
        fill: 'none',
        'stroke-width': 0.5,
        stroke: SPRITE_PATH_COLOR,
      });

      spriteLayerNode.appendChild(this.spritePathNode);
    }

    const pathString = this.pathToString([from, to]);

    requestAnimationFrame(() => {
      this.spritePathNode.setAttribute('d', pathString);
    });
  }

  commitPath = (event) => {
    event.preventDefault();
    const pathNode = this.activePathNode;
    this.activePathNode = null;
    this.#ee.emit('path:commit', { target: pathNode });
    this.spritePathNode.setAttribute('d', '');

    document.removeEventListener('contextmenu', this.commitPath);
  };
}
