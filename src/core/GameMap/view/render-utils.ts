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

export function detectCollision(a, b) {
  const HITBOX_COEFFICIENT = 0.5;
  return (
    a.x + a.width * HITBOX_COEFFICIENT > b.x &&
    a.x < b.x + b.width * HITBOX_COEFFICIENT &&
    a.y + a.height * HITBOX_COEFFICIENT > b.y &&
    a.y < b.y + b.height * HITBOX_COEFFICIENT
  );
}
