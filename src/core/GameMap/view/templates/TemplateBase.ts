// TODO:
export function makeTemplate(innerHTML: string): Node {
  const template = document.createElement('template');
  template.innerHTML = innerHTML;
  const node = template.content.cloneNode(true);
  return node;
}
