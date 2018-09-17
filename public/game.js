import View from './View.js'

function createInitialState(rows, cols){
  let state = new Array(rows);
  for (let row = 0; row < rows; row++){
    state[row] = new Array(cols).fill(0);
  }
  return state;
}

function copyMatrix(matrix){
  const matrixAsString = matrix.map(row => row.join(',')).join('|');
  return matrixAsString.split('|').map(row => row.split(',').map(item => parseInt(item)));
}

function checkNeighboorhood(cell){
  let liveNeighbors = 0;
  let deadNeighbors = 0;
  const row = cell.row;
  const col = cell.col;

  for (let rowOffset = -1; rowOffset <= 1; rowOffset++){
    //handle corner cases
    if (row + rowOffset < 0 || row + rowOffset === gameState.length){
      continue;
    }

    for (let colOffset = -1; colOffset <= 1; colOffset++){
      //handle corner cases
      if (col + colOffset < 0 || col + colOffset === gameState[0].length){
        continue;
      }

      //do not check the cell itself, only its neighbors
      if (rowOffset === 0 && colOffset === 0){
        continue;
      }
      if (gameState[row + rowOffset][col + colOffset] === 1){
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

function run(){
  const rows = gameState.length;
  const cols = gameState[0].length;
  
  const newGameState = copyMatrix(gameState);

  for (let row = 0; row < rows; row++){
    for (let col = 0; col < cols; col++){
      let curCel = gameState[row][col];
      const neighborhood = checkNeighboorhood({row, col});

      if (curCel === 1 && neighborhood.live < 2){
        newGameState[row][col] = 0;
      }
      if (curCel === 1 && neighborhood.live > 3){
        newGameState[row][col] = 0;
      }
      if (curCel === 0 && neighborhood.live === 3){
        newGameState[row][col] = 1;
      }
    }
  }

  gameState = newGameState;
  gameView.setState(gameState);

  if (state === 'playing'){
    requestAnimationFrame(run);
  }
}

let state = 'stopped';
const canvas = document.getElementById('canvas');
const gameView = new View(canvas);

//let gameState = [
//   [0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0],
//   [0, 0, 1, 0, 0],
//   [0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0]
// ]
let gameState = createInitialState(20,20);
gameView.drawGrid(20,20, gameState);

gameView.onMouseMove(event => {
  gameView.highlightCell(event.cell);
})

gameView.onMouseClick(event => {
  console.log(`You clicked on cell ${event.cell.row}, ${event.cell.col}`);
  const cell = event.cell;

  let selected = true;
  if (gameState[cell.row][cell.col] === 1){
    gameState[cell.row][cell.col] = 0;
    selected = false;
  } else {
    gameState[cell.row][cell.col] = 1;
  }
  gameView.setCellSelected(event.cell, selected);
});

const playButton = document.getElementById('playbutton');
playButton.addEventListener('click', () => {
  if (state === 'playing'){
    gameView.stopClock();
    state = 'stopped';
  } else {
    state = 'playing';
    gameView.startClock();
    run();
  }
});

const stepButton = document.getElementById('stepbutton');
stepButton.addEventListener('click', () => {
  run();
})