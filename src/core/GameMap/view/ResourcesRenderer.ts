import randomcolor from 'randomcolor';
import type { Vertice } from '../../Vector';
import { Renderer } from './Renderer';
import { createSVGElement, detectCollision } from './render-utils';

const BELT_SPEED = 0.1;
const EMIT_SPEED = 400;
const CONSUME_SPEED = 600;
const RESOURCE_ITEM_COLOR = '#031450';
const RESOURCE_ITEM_RADIUS = 0.3;

type ResourceItem = {
  index: number;
  distance: number;
  element: SVGElement;
};

export class ResourcesRenderer extends Renderer<SVGElement> {
  observer: IntersectionObserver;

  constructor(root) {
    super(root);
    this.observer = new IntersectionObserver(this.observeHandler.bind(this));
  }

  static getResourceItemRect(item: ResourceItem) {
    return {
      width: RESOURCE_ITEM_RADIUS * 2,
      height: RESOURCE_ITEM_RADIUS * 2,
      x: +item.element.attributes.getNamedItem('cx'),
      y: +item.element.attributes.getNamedItem('cy'),
    };
  }

  observeHandler(entry) {
    console.log(entry);
  }

  ballLength = 0;
  moveResourcesAlongPath(event) {
    const path = event.target;
    const pathResources: ResourceItem[] = [];
    const pathLength = path.getTotalLength();
    const start = path.getPointAtLength(0);

    const emitIntervalId = setInterval(() => {
      if (pathResources.length > pathLength) {
        clearInterval(emitIntervalId);
        return;
      }
      const distance = 0;

      const ball = createSVGElement('circle', {
        fill: randomcolor(),
        r: RESOURCE_ITEM_RADIUS,
        cx: start.x,
        cy: start.y,
      });

      const resourceItem = {
        index: 0,
        element: ball,
        distance,
      };
      this.observer.observe(resourceItem.element);

      const length = pathResources.push(resourceItem);
      resourceItem.index = length - 1;

      requestAnimationFrame(() => {
        this.ballLength++;
        console.log(this.ballLength);
        this.root.appendChild(ball);
      });

      requestAnimationFrame(() => animate(resourceItem));
    }, EMIT_SPEED);

    const animate = (item) => {
      const nextIndex = item.index - 1;
      const nextItem = pathResources[nextIndex];

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
        this.observer.unobserve(item.element);
        setTimeout(() => {
          this.ballLength--;
          item.element.remove();
        }, CONSUME_SPEED);
        return;
      }

      const position = path.getPointAtLength(item.distance);

      requestAnimationFrame(() => {
        item.element.setAttribute('cx', position.x);
        item.element.setAttribute('cy', position.y);
        requestAnimationFrame(() => animate(item));
      });
    };
  }
}
