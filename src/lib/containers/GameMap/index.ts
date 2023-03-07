import { GameMap } from './GameMap';
import { GameMapController } from './controller';
import { GameMapHTMLRenderer } from './renderer';

const MAP_SIZE = 64;
const HEIGHT = MAP_SIZE / 2;
const WIDTH = MAP_SIZE;

const map = new GameMap(WIDTH, HEIGHT);
console.log(`Game map created - ${map.name} (size ${map.size} fields)`);

const renderer = new GameMapHTMLRenderer(
  document.getElementById('game-map'),
  map,
);

export const controller = new GameMapController(renderer);
