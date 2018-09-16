export default class GridHelper{
  
  constructor(canvas){
    if (!canvas || !canvas.nodeName || canvas.nodeName !== "CANVAS"){
      throw new Error('GridHelper expects a CANVAS node as argument');
    }
    this._canvas = canvas;
    this._ctx = this._canvas.getContext('2d');
  }

  drawGrid(rows, cols){
    this._rows = rows;
    this._cols = cols;
    this._rowHeight = this._canvas.height / this._rows;
    this._colWidth = this._canvas.width / this._cols;

    this._drawRows();
    this._drawCols();
  }
  
  _drawRows(color = '#777777'){
    this._canvas.strokeStyle = color;
    
    for (let row = 0; row < this._rows; row++){
      let start = {x: 0, y: row * this._rowHeight};
      let end = {x: this._canvas.width, y : row * this._rowHeight};

      this._drawLine(start, end);
    }
    this._drawLine({x: 0, y: this._canvas.height}, {x: this._canvas.width, y: this._canvas.height});
  }
  
  _drawCols(color = '#777777'){
    this._canvas.strokeStyle = color;

    for (let col = 0; col < this._cols; col++){
      let start = {x: col * this._colWidth, y: 0};
      let end = {x: col * this._colWidth, y: this._canvas.height}
      this._drawLine(start, end);
    }
    this._drawLine({x: this._canvas.width, y: 0}, {x:this._canvas.width, y: this._canvas.height});
  }
  
  _drawLine(start, end){
    this._ctx.moveTo(start.x, start.y);
    this._ctx.lineTo(end.x, end.y);
    this._ctx.stroke();
  }

  mouseCoord2gridCoord(x, y){
    const row = y / this._rowHeight;
    const col = x / this._colWidth;
    return {
      row: Math.floor(row), 
      col: Math.floor(col)
    };
  }
}
