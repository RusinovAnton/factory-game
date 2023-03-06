import Controls from './Controls.svelte';
import './index.css';
import { GameMap } from './lib/components/GameMap';
import { GameMapController } from './lib/controller';
import { GlobalGameState } from './lib/global-state';
import type { GlobalGameStateI } from './lib/global-state';
import { HTMLElementRenderer } from './lib/ui/renderer';

console.dir(import.meta);

declare global {
  interface Window {
    ___GAME_MAP_STATE: GlobalGameStateI;
  }
}

window.___GAME_MAP_STATE = new GlobalGameState();

console.log('Hello World!');

const MAP_SIZE = 64;
const HEIGHT = MAP_SIZE / 2;
const WIDTH = MAP_SIZE;

const map = new GameMap(WIDTH, HEIGHT);
console.log(`Game map created - ${map.name} (size ${map.size} fields)`);

const renderer = new HTMLElementRenderer(
  document.getElementById('game-map'),
  map,
);

const controller = new GameMapController(renderer);

const app = new Controls({
  target: document.getElementById('interface'),
  props: {
    onStructureSelect(factoryType: string) {
      controller.selectStructure(factoryType);
    },
  },
});

export default app;
