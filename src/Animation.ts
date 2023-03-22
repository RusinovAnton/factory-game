export class Animation {
  boundRun: () => {};

  constructor() {
    this.boundRun = this.run.bind(this);
  }

  start() {}

  run() {
    window.requestAnimationFrame(() => {
      this.boundRun();
    });
  }

  stop() {}
}
