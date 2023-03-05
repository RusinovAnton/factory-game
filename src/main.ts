import './index.css'
import './index'
import GameMap from './GameMap.svelte'

const app = new GameMap({
  target: document.getElementById('interface'),
})

export default app
