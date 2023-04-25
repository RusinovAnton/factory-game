import randomcolor from 'randomcolor';
import type { Vertice } from '../../Vector';
import type { EventEmitter } from '../../utils/event-emitter';
import { Renderer } from './Renderer';
import { createSVGElement } from './render-utils';

const SPRITE_PATH_COLOR = 'rgba(0, 100, 200, 0.4)';
const INVALID_SPRITE_PATH_COLOR = 'rgba(250, 50, 0, 0.4)';

const PATH_WIDTH = 0.7;
const PATH_COLOR = '#707075';

export class PathRenderer extends Renderer<SVGElement> {
  foreground: SVGElement;
  activePath: SVGElement;
  spritePath: SVGElement;

  #ee: EventEmitter;

  constructor(root: SVGElement, foreground: SVGElement, ee: EventEmitter) {
    super(root);
    this.foreground = foreground;

    this.#ee = ee;
  }

  pathToString(pathAnchors: Vertice[]): string {
    const pathString = pathAnchors.reduce((str, point: Vertice, index) => {
      const command = index === 0 ? 'M' : 'L';
      const { x, y } = point;

      // Start path from the middle of a cell
      const toX = x + 0.5;
      const toY = y + 0.5;

      return `${str}${command} ${toX} ${toY} `;
    }, '');

    return pathString;
  }

  drawPath(pathAnchors: Vertice[], startPath = true) {
    if (startPath) {
      this.activePath = createSVGElement('path', {
        id: `path-${pathAnchors[0].x}-${pathAnchors[0].y}`,
        fill: 'none',
        'stroke-width': PATH_WIDTH,
        stroke: randomcolor(),
      });

      this.root.appendChild(this.activePath);
      document.addEventListener('contextmenu', this.commitPath);
    }

    const pathString = this.pathToString(pathAnchors);
    this.activePath.setAttribute('d', pathString);
    return this.activePath;
  }

  drawSprite(anchors: Vertice[], valid = true) {
    if (!this.spritePath) {
      this.spritePath = createSVGElement('path', {
        fill: 'none',
        'stroke-width': PATH_WIDTH,
      });

      requestAnimationFrame(() => {
        this.foreground.appendChild(this.spritePath);
      });
    }

    // FIXME: performance?
    this.spritePath.setAttribute(
      'stroke',
      valid ? SPRITE_PATH_COLOR : INVALID_SPRITE_PATH_COLOR,
    );

    const pathString = this.pathToString(anchors);

    requestAnimationFrame(() => {
      this.spritePath.setAttribute('d', pathString);
    });
  }

  commitPath = (event) => {
    event.preventDefault();
    const pathNode = this.activePath;
    this.#ee.emit('path:commit', { target: pathNode });
    document.removeEventListener('contextmenu', this.commitPath);
    requestAnimationFrame(() => {
      this.spritePath.setAttribute('d', '');
      this.spritePath.setAttribute('stroke', '');
    });
  };

  cancelLastPath() {
    this.activePath.remove();
    this.activePath = null;
  }
}
