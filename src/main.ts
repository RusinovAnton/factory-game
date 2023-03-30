import 'normalize.css';
import './index.css';

import Controls from './Controls.svelte';
import { controller } from './core/GameMap';

console.log('Hello World!');

const nodes = {
  map: document.getElementById('game-map'),
  controls: document.getElementById('interface'),
};

controller.init(nodes.map);

const app = new Controls({
  target: nodes.controls,
  props: {
    onStructureSelect(factoryType: string) {
      controller.selectStructure(factoryType);
    },
  },
});

export default app;
