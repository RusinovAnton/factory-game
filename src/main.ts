import Controls from './Controls.svelte';
import 'normalize.css';
import './index.css';
import { controller } from './lib/containers/GameMap';

console.log('Hello World!');

const app = new Controls({
  target: document.getElementById('interface'),
  props: {
    onStructureSelect(factoryType: string) {
      controller.selectStructure(factoryType);
    },
  },
});

export default app;
