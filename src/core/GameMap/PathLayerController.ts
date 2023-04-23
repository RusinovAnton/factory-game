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
    const { coord } = event;

    if (!this.activePath) {
      this.startPath(coord);
    } else {
      this.addPathPoint(coord);
    }
  }

  pathValid = true;
  handleCellHover(event) {
    if (!this.activePath) return;
    const { coord } = event;
    const startAnchor =
      this.activePath.anchors[this.activePath.anchors.length - 1];
    const endAnchor = coord;
    this.model.pathLayer;

    const spritePath = new Path(startAnchor, endAnchor);
    this.pathValid = !this.model.pathLayer.checkIntersection(
      spritePath.everyPoint,
      true,
    );
    this.view.drawSprite(spritePath.anchors, this.pathValid);
  }

  startPath(anchor: Vector) {
    if (this.model.pathLayer.checkIntersection([anchor])) {
      return;
    }

    this.activePath = new Path(anchor);
    this.renderActivePath(true);
  }

  addPathPoint(anchor: Vector) {
    if (!this.pathValid) {
      console.error('path is invalid, cannot add point');
      return;
    }
    if (!this.activePath) {
      throw new Error("Can't add path anchor point: Path is not created yet");
    }
    this.activePath = this.activePath.addPoint(anchor);
    this.model.pathLayer.addPath(this.activePath);
    this.renderActivePath();
  }

  commitPath() {
    const path = this.activePath;
    this.activePath = null;
    if (path.anchors.length === 1) {
      this.view.cancelLastPath();
      return;
    }
    this.model.pathLayer.addPath(path);
  }

  renderActivePath(startPath = false) {
    this.view.drawPath(this.activePath.anchors, startPath);
  }
}
