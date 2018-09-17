export default class View{
  
  constructor(canvas){
    if (!canvas || !canvas.nodeName || canvas.nodeName !== "CANVAS"){
      throw new Error('View expects a CANVAS node as argument');
    }
    this._canvas = canvas;
    this._ctx = this._canvas.getContext('2d');

    this._lastHighlightedCell = null;

    this._bufferCanvas = document.createElement('canvas');
    this._bufferCanvas.width = this._canvas.width;
    this._bufferCanvas.height = this._canvas.height;
    this._bufferCtx = this._bufferCanvas.getContext('2d');
  }

  drawGrid(rows, cols, initialState){
    if (initialState){
      this._validateInitialState(rows, cols, initialState);
    }

    this._rows = rows;
    this._cols = cols;
    this._rowHeight = this._canvas.height / this._rows;
    this._colWidth = this._canvas.width / this._cols;

    this._bufferCtx.fillStyle = '#FFFFFF';
    this._bufferCtx.fillRect(0, 0, this._bufferCanvas.width, this._bufferCanvas.height);
    this._drawRows();
    this._drawCols();

    if (initialState){
      this.setState(initialState);
      this.saveState();
    }

    this.redraw();
  }

  _validateInitialState(rows, cols, initialState){
    if (!Array.isArray(initialState) || !Array.isArray(initialState[0])){
      throw new Error('initialState expected to be a matrix!');
    }

    if (rows !== initialState.length || cols !== initialState[0].length){
      throw new Error('initialState dimensions do not match provided "rows" and "cols" parameters');
    }
  }

  setState(stateMatrix){
    for (let row = 0; row < stateMatrix.length; row++){
      for (let col = 0; col < stateMatrix[0].length; col++){
        if (stateMatrix[row][col] === 1){
          this.setCell({row, col}, true);
        }
      }
    }
  }

  saveState(){
    this._bufferCtx.drawImage(this._canvas, 0, 0);
  }

  redraw(){
    this._ctx.drawImage(this._bufferCanvas, 0, 0);
  }
  
  _drawRows(color = '#777777'){
    this._bufferCtx.strokeStyle = color;
    
    for (let row = 0; row < this._rows; row++){
      let start = {x: 0, y: row * this._rowHeight};
      let end = {x: this._canvas.width, y : row * this._rowHeight};

      this._drawLine(this._bufferCtx, start, end);
    }
    this._drawLine(this._bufferCtx, {x: 0, y: this._canvas.height}, {x: this._canvas.width, y: this._canvas.height});
  }
  
  _drawCols(color = '#777777'){
    this._bufferCtx.strokeStyle = color;

    for (let col = 0; col < this._cols; col++){
      let start = {x: col * this._colWidth, y: 0};
      let end = {x: col * this._colWidth, y: this._canvas.height}
      this._drawLine(this._bufferCtx, start, end);
    }
    this._drawLine(this._bufferCtx, {x: this._canvas.width, y: 0}, {x:this._canvas.width, y: this._canvas.height});
  }
  
  _drawLine(ctx, start, end){
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  setCell(cell, state){
    const color = state ? '#25477c' : '#FFFFFF';
    this._fillCell(cell, color);
  }

  highlightCell(cell, color='#5c88ce'){
    this.redraw();
    this._fillCell(cell, color);
  }

  _fillCell(cell, color){
    const startX = cell.col * this._colWidth;
    const endX = startX + this._colWidth;
    const startY = cell.row * this._rowHeight;
    const endY = startY + this._rowHeight;

    this._ctx.fillStyle = color;
    this._ctx.fillRect(startX, startY, this._colWidth, this._rowHeight);
  }

  onMouseMove(callback){
    this._canvas.addEventListener('mousemove', event => {
      const {x, y} = this._getRealMouseCoordinate(event);
      const cell = this._mouseCoord2gridCoord(x, y);

      callback({
        cell,
        coordinates: {x, y}
      })
    })
  }

  _getRealMouseCoordinate(event){
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;  
  
    return {x, y}
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
