import Game from './Game.js';

function handleButtonClick(buttonId, callback) {
  document.getElementById(buttonId).addEventListener('click', event => {
    callback(event);
  });
}

let gameState = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const game = new Game();
game.startNew(gameState);

handleButtonClick('playbutton', () => {
  game.playPause();
});

handleButtonClick('stopbutton', () => {
  game.stop();
});

handleButtonClick('stepbutton', () => {
  game.runSingleStep();
});

handleButtonClick('clearbutton', () => {
  game.clear();
});

handleButtonClick('randombutton', () => {
  const rows = parseInt(document.getElementById('inputrows').value);
  const cols = parseInt(document.getElementById('inputcols').value);

  game.startNew({
    rows,
    cols,
    value: function(){
      return Math.random() > 0.7 ? 1 : 0;
    }
  });
});

handleButtonClick('setupgridbutton', () => {
  const rows = parseInt(document.getElementById('inputrows').value);
  const cols = parseInt(document.getElementById('inputcols').value);

  game.startNew({
    rows,
    cols,
    value: 0
  });
});