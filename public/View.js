export default class View{
  
  constructor(canvas){
    if (!canvas || !canvas.nodeName || canvas.nodeName !== 'CANVAS'){
      throw new Error('View expects a CANVAS node as argument');
    }
    this._canvas = canvas;
    this._ctx = this._canvas.getContext('2d');

    this._bufferCanvas = document.createElement('canvas');
    this._bufferCanvas.width = this._canvas.width;
    this._bufferCanvas.height = this._canvas.height;
    this._bufferCtx = this._bufferCanvas.getContext('2d');
  }

  drawGrid(initialState){
    if (!initialState){
      throw new Error('initialState is mandatory');
    }

    this._rows = initialState.length;
    this._cols = initialState[0].length;
    this._rowHeight = this._canvas.height / this._rows;
    this._colWidth = this._canvas.width / this._cols;

    this._bufferCtx.fillStyle = '#FFFFFF';
    this._bufferCtx.fillRect(0, 0, this._bufferCanvas.width, this._bufferCanvas.height);

    this.setState(initialState);
    this.saveState();

    this.redraw();
  }

  setState(stateMatrix){
    for (let row = 0; row < stateMatrix.length; row++){
      for (let col = 0; col < stateMatrix[0].length; col++){
        let enabled = true;
        if (stateMatrix[row][col] !== 1){
          enabled = false;
        }
        this.setCellSelected({row, col}, enabled);
      }
    }
    this._ctx.stroke();
  }

  saveState(){
    this._bufferCtx.drawImage(this._canvas, 0, 0);
  }

  redraw(){
    this._ctx.drawImage(this._bufferCanvas, 0, 0);
  }
  
  setCellSelected(cell, state){
    const color = state ? '#25477c' : '#FFFFFF';
    this._fillCell(cell, color);
    this.saveState();
  }

  highlightCell(cell, color='#5c88ce'){
    this.redraw();
    this._fillCell(cell, color);
    this._ctx.stroke();
  }

  _fillCell(cell, color){
    const startX = cell.col * this._colWidth;
    const startY = cell.row * this._rowHeight;

    this._ctx.fillStyle = color;
    this._ctx.fillRect(startX, startY, this._colWidth, this._rowHeight);

    this._ctx.rect(startX, startY, this._colWidth, this._rowHeight);
  }

  onMouseMove(callback){
    this._prepareEventHandling('mousemove', callback);
  }

  onMouseClick(callback){
    this._prepareEventHandling('click', callback);
  }

  _prepareEventHandling(eventName, callback){
    this._canvas.addEventListener(eventName, event => {
      const {x, y} = this._getRealMouseCoordinate(event);
      const cell = this._mouseCoord2gridCoord(x, y);

      callback({
        cell,
        coordinates: {x, y}
      });
    });
  }

  _getRealMouseCoordinate(event){
    const rect = this._canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;  
  
    return {x, y};
  }
  
  _mouseCoord2gridCoord(x, y){
    const row = y / this._rowHeight;
    const col = x / this._colWidth;
    return {
      row: Math.floor(row), 
      col: Math.floor(col)
    };
  }
}
