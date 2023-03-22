import 'normalize.css';
import './index.css';

import Controls from './Controls.svelte';
import { controller } from './core/GameMap';

console.log('Hello World!');

controller.init();

const app = new Controls({
  target: document.getElementById('interface'),
  props: {
    onStructureSelect(factoryType: string) {
      controller.selectStructure(factoryType);
    },
  },
});

export default app;
