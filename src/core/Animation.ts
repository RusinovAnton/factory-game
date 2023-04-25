import { EventEmitter, type Emitter } from './utils/event-emitter';

const maxDtMs = 1000;
const resetDtMs = 16;

export class AnimationFrame implements Emitter {
  stopped = false;
  lastTime: number;
  #ee: EventEmitter;
  on: EventEmitter['on'];
  once: EventEmitter['once'];
  boundRun;

  constructor() {
    const ee = new EventEmitter('animation-frame');
    this.#ee = ee;
    this.on = this.#ee.on.bind(this.#ee);
    this.once = this.#ee.once.bind(this.#ee);

    this.boundRun = this.run.bind(this);
  }

  run(time) {
    if (this.stopped) return;

    let dt = time - this.lastTime;

    if (dt > maxDtMs) {
      dt = resetDtMs;
    }

    try {
      this.#ee.emit('frameemitted', dt);
    } catch (ex) {
      console.error(ex);
    }
    window.requestAnimationFrame(this.boundRun);
    this.lastTime = time;
  }

  start(time) {
    this.stopped = false;
    this.run(time);
  }

  stop() {
    this.stopped = true;
  }
}
