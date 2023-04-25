import randomColor from 'randomcolor';
import { Vector } from '../../Vector';
import { createSVGElement } from './render-utils';
import { Renderer } from './Renderer';

export class StructureRenderer extends Renderer<SVGElement> {
  state = {
    selectedStructureType: null,
  };

  drawStructure(coord, structure) {
    console.debug(
      'Draw structure: ',
      structure.name,
      ' at x: ',
      coord.x,
      'y: ',
      coord.y,
    );
  }

  selectStructure(factoryType: string | null) {
    if (this.state.selectedStructureType) {
      document.body.classList.remove(
        `factory-type-selected--${this.state.selectedStructureType}`,
      );
    }

    this.state.selectedStructureType = factoryType;
    if (!factoryType) return;
    document.body.classList.add(`factory-type-selected--${factoryType}`);
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

    this.root.appendChild(polygon);
  }
}
