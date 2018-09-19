export function copyMatrix(matrix){
  const matrixAsString = matrix.map(row => row.join(',')).join('|');
  return matrixAsString.split('|').map(row => row.split(',').map(item => parseInt(item)));
}