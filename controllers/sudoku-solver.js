class SudokuSolver {
  rowConverter(row){
    const rows = {
      A : 0, 
      B : 1, 
      C : 2,
      D : 3,
      E : 4,
      F : 5,
      G : 6,
      H : 7,
      I : 8
      }
      return rows.hasOwnProperty(row) ? rows[row] : null;
  }

  columnConverter(column){
    return column >= 1 && column <= 9 ? column - 1 : null;
  }

  validate(puzzleString) {
    return !(/[^.0-9]/.test(puzzleString));
  }

  validateLength(puzzleString){
    return puzzleString.length == 81;
  }

  checkRowPlacement(puzzleArray, row, column, value) {
    for(let i = 0; i < 9; i++)
      if(puzzleArray[row * 9 + i] == String(value))
        return false;
    return true;
  }

  checkColPlacement(puzzleArray, row, column, value) {
    for(let i = 0; i < 9; i++)
      if(puzzleArray[i * 9 + column] == String(value))
        return false;
    return true;
  }

  checkRegionPlacement(puzzleArray, roww, columnn, value) {
    let row = Math.floor(roww / 3) * 3;
    let column = Math.floor(columnn / 3);

    for(let i = 0; i < 3; i++)
    {
      if(puzzleArray[row * 9 + 3 * column + i] == String(value) || 
      puzzleArray[(row + 1) * 9 + 3 * column + i] == String(value) || 
      puzzleArray[(row + 2) * 9 + 3 * column + i] == String(value))
        return false;
    }
    return true;
  }

  solve(puzzleString) {
    if(!this.validate(puzzleString) || !this.validateLength(puzzleString))
      return false;
    let puzzleArray = puzzleString.split("");
    if(this.recursiveSolve(puzzleArray, 0, 0))
      return puzzleArray.join("");
    else
      return "";
  }

  recursiveSolve(puzzleArray, row, column){
    if(row == 8 && column == 9)
      return true;
    let r = row;
    let c = column;
    if(c == 9)
    {
      r++;
      c = 0;
    }
    const pos = 9 * r + c;
    if(puzzleArray[pos] == '.')
    {
      for(let i = 1; i <= 9; i++)
      {
        if(this.checkRowPlacement(puzzleArray, r, c, i) && this.checkColPlacement(puzzleArray, r, c, i) && this.checkRegionPlacement(puzzleArray, r, c, i))
        {
          puzzleArray[pos] = String(i);
          if(this.recursiveSolve(puzzleArray, r, c + 1))
            return true;
          puzzleArray[pos] = '.';
        }
      }
      return false;
    }
    else
      return this.recursiveSolve(puzzleArray, r, c + 1);
  }
}

module.exports = SudokuSolver;

