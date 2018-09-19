export default class Clock {
  constructor() {
    this._clock = document.getElementById('clock');
    this._state = 'stopped';

    this._requestId = null;
    this._lastConsideredDate = null;
    this._timeElapsedMs = 0;
  }

  start() {
    this._state = 'running';
    this._lastConsideredDate = new Date();
    this._update();
  }

  _update() {
    const delta = new Date() - this._lastConsideredDate;
    this._timeElapsedMs += delta;
    this._setClockText(this._timeElapsedMs);
    this._lastConsideredDate = new Date();

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
    this._timeElapsedMs = 0;

    //send this to the end of the eventloop queue to ensure the animation
    //frame request really got cancelled
    setTimeout(() => this._setClockText(0), 0);
  }

  pause() {
    this._state = 'paused';
  }

  resume() {
    this._lastConsideredDate = new Date();
    this._state = 'running';

    if (this._state === 'stopped') {
      this.start();
    }

    this._update();
  }
}