import View from './View.js'

function createInitialState(rows, cols){
  let state = new Array(rows);
  for (let row = 0; row < rows; row++){
    state[row] = new Array(cols).fill(0);
  }
  return state;
}

const canvas = document.getElementById('canvas');
const gameView = new View(canvas);

// let gameState = [
//   [1, 0, 1, 0, 1],
//   [0, 0, 0, 0, 1],
//   [0, 1, 1, 0, 0],
//   [0, 0, 1, 0, 0],
//   [0, 0, 0, 0, 0]
// ]
let gameState = createInitialState(20, 20);
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
})