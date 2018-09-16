import GridHelper from './GridHelper.js'

const canvas = document.getElementById('canvas');

let lastVisitedCell = null;

['mousemove','click'].forEach(eventName => {
  canvas.addEventListener(eventName, (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;  
  
    const cell = grid.mouseCoord2gridCoord(mouseX, mouseY);
    grid.highlightCell(cell);
  });
})

const grid = new GridHelper(canvas);
grid.drawGrid(5,5);