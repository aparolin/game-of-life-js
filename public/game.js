import Grid from './Grid.js';
import Clock from './Clock.js';
import { copyMatrix } from './utils.js';

export default class Game {
  constructor() {
    this._state = 'stopped';

    this._clock = new Clock();

    const canvas = document.getElementById('canvas');
    this._grid = new Grid(canvas);
    this._gameState = null;

    this._grid.onMouseMove(event => {
      this._grid.highlightCell(event.cell);
    });
    
    this._grid.onMouseClick(event => {
      const cell = event.cell;
    
      let selected = true;
      if (this._gameState[cell.row][cell.col] === 1) {
        this._gameState[cell.row][cell.col] = 0;
        selected = false;
      } else {
        this._gameState[cell.row][cell.col] = 1;
      }
      this._grid.setCellSelected(event.cell, selected);
    });
  }

  startNew(initialSetup){
    if (Array.isArray(initialSetup)){
      this._gameState = initialSetup;
    } else if (typeof(initialSetup) === 'object'){
      this._gameState = this._createGameState(initialSetup.rows, initialSetup.cols, initialSetup.value);
    } else {
      throw new Error('Type of initialSetup should be a 2D matrix, or an object containing rows and cols');
    }

    this._grid.init(this._gameState);
  }

  _createGameState(rows, cols, value = 0) {
    let state = new Array(rows);
    for (let row = 0; row < rows; row++) {
      state[row] = new Array(cols);
      for (let col = 0; col < cols; col++) {
        if (typeof value === 'function'){
          state[row][col] = value();
        } else{
          state[row][col] = value;
        }
      }
    }
    return state;
  }

  _run() {
    const rows = this._gameState.length;
    const cols = this._gameState[0].length;
  
    const newGameState = copyMatrix(this._gameState);
  
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let curCel = this._gameState[row][col];
        const neighborhood = this._checkNeighboorhood({ row, col });
  
        //apply rules
        if (curCel === 1 && neighborhood.live < 2) {
          newGameState[row][col] = 0;
        }
        if (curCel === 1 && neighborhood.live > 3) {
          newGameState[row][col] = 0;
        }
        if (curCel === 0 && neighborhood.live === 3) {
          newGameState[row][col] = 1;
        }
      }
    }
  
    this._gameState = newGameState;
    this._grid.setState(this._gameState);
  
    if (this._state === 'playing') {
      requestAnimationFrame(this._run.bind(this));
    }
  }

  _checkNeighboorhood(cell) {
    let liveNeighbors = 0;
    let deadNeighbors = 0;
    const row = cell.row;
    const col = cell.col;
  
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      //handle corner cases
      if (row + rowOffset < 0 || row + rowOffset === this._gameState.length) {
        continue;
      }
  
      for (let colOffset = -1; colOffset <= 1; colOffset++) {
        //handle corner cases
        if (col + colOffset < 0 || col + colOffset === this._gameState[0].length) {
          continue;
        }
  
        //do not check the cell itself, only its neighbors
        if (rowOffset === 0 && colOffset === 0) {
          continue;
        }
  
        //check neighbor
        if (this._gameState[row + rowOffset][col + colOffset] === 1) {
          liveNeighbors++;
        } else {
          deadNeighbors++;
        }
      }
    }
  
    return {
      live: liveNeighbors,
      dead: deadNeighbors
    };
  }

  playPause(){
    if (this._state === 'playing') {
      this._clock.pause();
      this._state = 'paused';
    } else {
      this._state = 'playing';
      this._clock.resume();
      this._run();
    }
  }

  stop(){
    this._clock.stop();
    this._state = 'stopped';
  }

  runSingleStep(){
    this._clock.resume();
    this._run();
    this._clock.pause();
  }

  clear(){
    for (let row = 0; row < this._gameState.length; row++) {
      for (let col = 0; col < this._gameState[0].length; col++) {
        this._gameState[row][col] = 0;
      }
    }
    this._grid.setState(this._gameState);
  }
}