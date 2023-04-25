import type { Vertice } from '../../Vector';
import { Renderer } from './Renderer';
import { createSVGElement, detectCollision } from './render-utils';

const BELT_SPEED = 0.1;
const EMIT_SPEED = 400;
const CONSUME_SPEED = 500;

export class ResourcesRenderer extends Renderer<SVGElement> {
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
      this.root.appendChild(ball);
    });

    return resourceItem;
  }

  emitIntervalId = null;

  // TODO:
  // This is a prototype func
  moveResourcesAlongPath(event) {
    const path = event.target;
    this.pathResources = [];
    const pathLength = path.getTotalLength();

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
}
