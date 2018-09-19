import Grid from './Grid.js';
import Clock from './Clock.js';
import { copyMatrix } from './utils.js';

function createGameState(rows, cols, value = 0) {
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

function checkNeighboorhood(cell) {
  let liveNeighbors = 0;
  let deadNeighbors = 0;
  const row = cell.row;
  const col = cell.col;

  for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
    //handle corner cases
    if (row + rowOffset < 0 || row + rowOffset === gameState.length) {
      continue;
    }

    for (let colOffset = -1; colOffset <= 1; colOffset++) {
      //handle corner cases
      if (col + colOffset < 0 || col + colOffset === gameState[0].length) {
        continue;
      }

      //do not check the cell itself, only its neighbors
      if (rowOffset === 0 && colOffset === 0) {
        continue;
      }

      //check neighbor
      if (gameState[row + rowOffset][col + colOffset] === 1) {
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

function run() {
  const rows = gameState.length;
  const cols = gameState[0].length;

  const newGameState = copyMatrix(gameState);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let curCel = gameState[row][col];
      const neighborhood = checkNeighboorhood({ row, col });

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

  gameState = newGameState;
  gameGrid.setState(gameState);

  if (state === 'playing') {
    requestAnimationFrame(run);
  }
}

let state = 'stopped';
const canvas = document.getElementById('canvas');
const gameGrid = new Grid(canvas);

// let gameState = [
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
//   [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
//   [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
//   [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0],
//   [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
//   [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
//   [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// ];
let gameState = createGameState(30,30);
gameGrid.draw(gameState);

gameGrid.onMouseMove(event => {
  gameGrid.highlightCell(event.cell);
});

gameGrid.onMouseClick(event => {
  const cell = event.cell;

  let selected = true;
  if (gameState[cell.row][cell.col] === 1) {
    gameState[cell.row][cell.col] = 0;
    selected = false;
  } else {
    gameState[cell.row][cell.col] = 1;
  }
  gameGrid.setCellSelected(event.cell, selected);
});

//buttons handling
function handleButtonClick(buttonId, callback) {
  document.getElementById(buttonId).addEventListener('click', event => {
    callback(event);
  });
}

const gameClock = new Clock();
handleButtonClick('playbutton', () => {
  if (state === 'playing') {
    gameClock.pause();
    state = 'paused';
  } else {
    state = 'playing';
    gameClock.resume();
    run();
  }
});

handleButtonClick('stopbutton', () => {
  gameClock.stop();
  state = 'stopped';
});

handleButtonClick('stepbutton', () => {
  gameClock.resume();
  run();
  gameClock.pause();
});

handleButtonClick('clearbutton', () => {
  for (let row = 0; row < gameState.length; row++) {
    for (let col = 0; col < gameState[0].length; col++) {
      gameState[row][col] = 0;
    }
  }
  gameGrid.setState(gameState);
});

handleButtonClick('randombutton', () => {
  const rows = gameState.length;
  const cols = gameState[0].length;

  gameState = createGameState(rows, cols, function(){
    return Math.random() > 0.7 ? 1 : 0;
  });
  gameGrid.setState(gameState);
});