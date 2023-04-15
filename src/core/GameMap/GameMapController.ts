import { Vector } from '../Vector';
import { gameSounds } from '../sound/GameSounds';
import { PathLayerController } from './PathLayerController';
import { GameMap } from './model/GameMap';
import { GameMapHTMLRenderer } from './view/GameMapHTMLRenderer';

// TODO:
const WIDTH = 64;
const HEIGHT = 64;

interface ViewState {
  activeTool: 'path' | null;
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
    const json = this.model.toJSON();
    const saveStr = JSON.stringify(json);
    localStorage.setItem('GAME_MAP', saveStr);
  }

  restoreSave() {}

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
    console.log(event);
  }

  #handleCellClick(event) {
    if (!this.state.activeTool) return;

    if (this.state.activeTool === 'path') {
      this.pathLayer.handleCellClick(event);
    } else if (this.state.activeTool === 'structure') {
      // this.structureLayer.handleCellClick(event)
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
