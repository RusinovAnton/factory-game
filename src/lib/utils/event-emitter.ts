import EventEmitter3 from 'eventemitter3';

// FIXME: get value from .env
const DEBUG = true;

export class EventEmitter extends EventEmitter3 {
  debug: boolean = DEBUG;

  constructor(debug?: boolean) {
    super();
    this.debug = DEBUG;
  }

  #log(eventType, payload) {
    if (!this.debug) return;
    console.debug(eventType, payload);
  }

  emit(eventType, payload): boolean {
    this.#log(eventType, payload);
    return super.emit(eventType, payload);
  }
}

export interface EmitterClass {
  on(eventType, fn, context?): EmitterClass;

  once(eventType, fn, context?): EmitterClass;
}
