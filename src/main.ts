import 'normalize.css';
import './styles.css';

import GameMenu from './GameMenu.svelte';
import { GameMapController } from './core/GameMap/GameMapController';

console.log('Hello World!');

const nodes = {
  map: document.getElementById('game-map'),
  menu: document.getElementById('interface'),
};

const controller = new GameMapController(nodes.map);

// @ts-ignore
window.theController = controller;

const app = new GameMenu({
  target: nodes.menu,
  props: {
    onStructureSelect(factoryType: string) {
      // controller.selectStructure(factoryType);
      console.log(factoryType);
    },
    onToolSelect(activeTool) {
      controller.selectTool(activeTool);
    },
  },
});

export default app;
