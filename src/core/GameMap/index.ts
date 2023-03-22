import { GameMap } from './GameMap';
import { GameMapController } from './GameMapController';
import { GameMapHTMLRenderer } from './GameMapHTMLRenderer';

const MAP_SIZE = 64;
const HEIGHT = MAP_SIZE / 2;
const WIDTH = MAP_SIZE;

const map = new GameMap(WIDTH, HEIGHT);
const view = new GameMapHTMLRenderer(document.getElementById('game-map'));

export const controller = new GameMapController(map, view);
