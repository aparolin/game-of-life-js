import GridHelper from './GridHelper.js'

const canvas = document.getElementById('canvas');

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;  

  console.log(grid.mouseCoord2gridCoord(mouseX, mouseY));
});

const grid = new GridHelper(canvas);
grid.drawGrid(5,5);