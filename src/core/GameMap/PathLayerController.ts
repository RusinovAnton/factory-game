import type { Vector } from '../Vector';
import type { GameMap } from './model/GameMap';
import { Path } from './model/Path';
import type { GameMapHTMLRenderer } from './view/GameMapHTMLRenderer';

export class PathLayerController {
  view: GameMapHTMLRenderer;
  model: GameMap;

  constructor(view: GameMapHTMLRenderer, model: GameMap) {
    this.view = view;
    this.model = model;

    this.view.on('path:commit', this.commitPath, this);
  }

  activePath: Path = null;

  handleCellClick(event) {
    console.log(`PathLayer click: `, event);

    const { coord } = event;

    if (!this.activePath) {
      this.startPath(coord);
    } else {
      this.addPathPoint(coord);
    }
  }

  handleCellHover(event) {
    if (!this.activePath) return;
    const { coord } = event;
    const startAnchor =
      this.activePath.anchors[this.activePath.anchors.length - 1];
    const endAnchor = coord;

    this.view.drawSprite(startAnchor, endAnchor);
  }

  startPath(anchor: Vector) {
    this.activePath = new Path(anchor);
    this.renderActivePath();
  }

  addPathPoint(anchor: Vector) {
    if (!this.activePath) {
      throw new Error("Can't add path anchor point: Path is not created yet");
    }
    this.activePath = this.activePath.addPoint(anchor);
    this.renderActivePath();
  }

  commitPath() {
    this.activePath = null;
  }

  renderActivePath() {
    this.view.drawPath(this.activePath.anchors);
  }
}
