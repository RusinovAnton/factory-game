import { Vector } from '../Vector';
import { gameSounds } from '../sound/GameSounds';
import { storage } from '../storage/Storage';
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
    this.#init(root);
  }

  save() {
    const map = this.model.toJSON();
    const saving = JSON.stringify({ map });

    return storage.save(saving).then(() => {
      alert('Saved successfully!');
      console.log('Saved successfully!');
    });
  }

  clearSave() {
    return storage.clear();
  }

  async restoreSave() {
    const savedState = await storage.restore();
    if (!savedState) return;
    return JSON.parse(savedState);
  }

  selectTool(activeTool: 'path' | 'structure' | null) {
    this.state.activeTool = activeTool;
  }

  async #init(root) {
    const savedState = await this.restoreSave();
    const size = { x: WIDTH, y: HEIGHT };
    this.model = new GameMap(size, savedState?.map);
    const {
      name,
      baseLayer: { layout, map: layoutMap },
      pathLayer: { pathList },
    } = this.model;

    this.view = new GameMapHTMLRenderer(root, size);
    this.pathLayer = new PathLayerController(this.view, this.model);

    this.#initEventListeners();

    this.view.render({
      name,
      layoutMap,
      layout,
      pathList,
    });
  }

  #initEventListeners() {
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
      this.view.structures.renderStructure(
        event.coord,
        this.state.selectedStructureType,
      );
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
