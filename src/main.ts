import 'normalize.css';
import './index.css';

import StructureMenu from './StructureMenu.svelte';
import { GameMapController } from './core/GameMap/GameMapController';

console.log('Hello World!');

const nodes = {
  map: document.getElementById('game-map'),
  structureMenu: document.getElementById('interface'),
};

const controller = new GameMapController(nodes.map);

// @ts-ignore
window.theController = controller;

const app = new StructureMenu({
  target: nodes.structureMenu,
  props: {
    onStructureSelect(factoryType: string) {
      // controller.selectStructure(factoryType);
      console.log(factoryType);
    },
  },
});

export default app;
