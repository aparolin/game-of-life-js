export default class Clock {
  constructor() {
    this._clock = document.getElementById('clock');
    this._state = 'stopped';

    this._requestId = null;
  }

  start() {
    this._state = 'running';
    this._gameStartedAt = new Date();
    this._update();
  }

  _update() {
    const msElapsed = new Date() - this._gameStartedAt;
    this._setClockText(msElapsed);

    if (this._state === 'running') {
      this._requestId = requestAnimationFrame(this._update.bind(this));
    }
  }

  _setClockText(text){
    this._clock.textContent = text + 'ms';
    this._clock.style.fontWeight = 'bold';
  }

  stop() {
    cancelAnimationFrame(this._requestId);
    this._state = 'stopped';

    //send this to the end of the eventloop queue to ensure the animation
    //frame request really got cancelled
    setTimeout(() => this._setClockText(0), 0);
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