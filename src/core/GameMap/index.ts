import { GameMapController } from './GameMapController';
import { GameMap } from './model/GameMap';
import { GameMapHTMLRenderer } from './view/GameMapHTMLRenderer';

// TODO:
const MAP_SIZE = 64;
const HEIGHT = MAP_SIZE / 2;
const WIDTH = MAP_SIZE;

const map = new GameMap(WIDTH, HEIGHT);
const view = new GameMapHTMLRenderer();

export const controller = new GameMapController(map, view);
