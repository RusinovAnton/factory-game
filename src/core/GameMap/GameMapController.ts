import { Vector } from '../Vector';
import { gameSounds } from '../sound/GameSounds';
import { PathLayerController } from './PathLayerController';
import { GameMap } from './model/GameMap';
import { GameMapHTMLRenderer } from './view/GameMapHTMLRenderer';

const WIDTH = 64;
const HEIGHT = 64;

interface ViewState {
  activeTool: 'path' | 'structure' | null;
  selectedStructureType: string | null;
}

export class GameMapController {
  view: GameMapHTMLRenderer;
  model: GameMap;
  state: ViewState = {
    selectedStructureType: null,
    activeTool: 'path',
  };
  pathLayer: PathLayerController;

  constructor(root: HTMLElement) {
    const size = new Vector(WIDTH, HEIGHT);
    this.model = new GameMap(size);
    const {
      name,
      baseLayer: { layout },
    } = this.model;

    this.view = new GameMapHTMLRenderer(root, size, {
      name,
      layout,
    });
    this.pathLayer = new PathLayerController(this.view, this.model);

    this.#init();
  }

  save() {
    const map = this.model.toJSON();
    const saveStr = JSON.stringify({ map });
    localStorage.setItem('GAME_MAP', saveStr);
  }

  // restoreSave() {}

  selectTool(activeTool: 'path' | 'structure' | null) {
    this.state.activeTool = activeTool;
  }

  #init() {
    /** View events */
    this.view.on('cell:click', this.#handleCellClick.bind(this));
    this.view.on('cell:mouseover', this.#handleCellHover.bind(this));

    /** Model events */
    this.model.on('path:start', this.#onPathUpdate, this);
    this.model.on('path:add-point', this.#onPathUpdate, this);
    this.model.on('path:commit', this.#onPathUpdate, this);
  }

  #onPathUpdate(event) {
    console.debug(event);
  }

  #handleCellClick(event) {
    if (!this.state.activeTool) return;

    if (this.state.activeTool === 'path') {
      gameSounds.pop();
      this.pathLayer.handleCellClick(event);
    } else if (this.state.activeTool === 'structure') {
      gameSounds.pop();
      this.view.renderStructure(event.coord, this.state.selectedStructureType);
    }

    return;
  }

  #handleCellHover(event) {
    gameSounds.haptic();
    if (!this.state.activeTool) return;

    if (this.state.activeTool === 'path') {
      this.pathLayer.handleCellHover(event);
    }
  }
}
