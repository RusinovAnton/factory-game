import EventEmitter3, {
  type EventEmitter as EventEmitterT,
} from 'eventemitter3';

// FIXME: get value from .env
const DEBUG = true;

export class EventEmitter extends EventEmitter3 {
  type?: string;
  debug?: boolean;

  constructor(type?: string, debug: boolean = DEBUG) {
    super();
    this.debug = debug;
  }

  #log(eventType, payload) {
    if (!this.debug) return;
    console.debug(eventType, payload);
  }

  emit(eventType, payload): boolean {
    this.#log(eventType, payload);
    if (this.type && !payload.hasOwnProperty('type')) {
      payload.type = payload.type || this.type;
    }
    return super.emit(eventType, payload);
  }
}

export interface Emittable {
  on: EventEmitterT['on'];
  once: EventEmitterT['once'];
}
