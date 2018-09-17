import View from './View.js'

const canvas = document.getElementById('canvas');

const gameView = new View(canvas);

const initialState = [
  [1, 0, 1, 0, 1],
  [0, 0, 0, 0, 1],
  [0, 1, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0]
]
gameView.drawGrid(5,5, initialState);

gameView.onMouseMove(event => {
  gameView.highlightCell(event.cell);
})