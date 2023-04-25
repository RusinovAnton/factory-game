export function setElementAttributes(element, attributes) {
  Object.entries(attributes).forEach(([key, value]) =>
    element.setAttribute(key, value),
  );
}

export function createSVGElement(tagName, attributes = {}) {
  const element = document.createElementNS(
    'http://www.w3.org/2000/svg',
    tagName,
  );

  setElementAttributes(element, attributes);

  return element;
}

type Rect = {
  width: number;
  height: number;
  x: number;
  y: number;
};

const HITBOX_COEFFICIENT = 0.5;

export function detectCollision(
  a: Rect,
  b: Rect,
  hitboxCoef = HITBOX_COEFFICIENT,
) {
  return (
    a.x + a.width * hitboxCoef > b.x &&
    a.x < b.x + b.width * hitboxCoef &&
    a.y + a.height * hitboxCoef > b.y &&
    a.y < b.y + b.height * hitboxCoef
  );
}
