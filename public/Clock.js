export default class Clock {
  constructor() {
    this._clock = document.getElementById('clock');
    this._state = 'stopped';
  }

  start() {
    this._state = 'running';
    this._gameStartedAt = new Date();
    this._update();
  }

  _update() {
    const msElapsed = new Date() - this._gameStartedAt;
    this._clock.textContent = msElapsed + 'ms';
    this._clock.style.fontWeight = 'bold';

    if (this._state === 'running') {
      requestAnimationFrame(this._update.bind(this));
    }
  }

  stop() {
    this._state = 'stopped';
  }

  pause() {
    this._state = 'paused';
  }

  resume() {
    if (this._state === 'stopped') {
      this.start();
    }

    this._update();
  }
}