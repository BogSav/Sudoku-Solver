'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const puzzleString = req.body.puzzle;

      if(puzzleString == null || req.body.value == null || req.body.coordinate == null)
        return res.json({ error: 'Required field(s) missing' });

      if(!solver.validate(puzzleString))
        return res.json({ error: 'Invalid characters in puzzle' });

      if(!solver.validateLength(puzzleString))
        return res.json({ error: 'Expected puzzle to be 81 characters long' });

      let arrSolution = puzzleString.split("");
      let row = solver.rowConverter(req.body.coordinate[0].toUpperCase());
      let column = solver.columnConverter(Number(req.body.coordinate[1]));
      let value = req.body.value;

      if(arrSolution[row * 9 + column] == value)
        return res.json({valid : true});

      if(row == null || column == null)
        return res.json({ error: 'Invalid coordinate'});

      if(value > 9 || value < 1 || /\D/.test(value))
        return res.json({ error: 'Invalid value' });

      let conflict = [];

      if(!solver.checkRowPlacement(arrSolution, row, column , value))
        conflict.push('row');
      if(!solver.checkColPlacement(arrSolution, row, column , value))
        conflict.push('column');
      if(!solver.checkRegionPlacement(arrSolution, row, column , value))
        conflict.push('region');

      if(conflict.length == 0)
        return res.json({valid : true});
      else
        return res.json({valid : false, conflict : conflict});
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzleString = req.body.puzzle;

      if(puzzleString == null || puzzleString == "")
        return res.json({ error: 'Required field missing' });

      if(!solver.validate(puzzleString))
        return res.json({ error: 'Invalid characters in puzzle' });

      if(!solver.validateLength(puzzleString))
        return res.json({ error: 'Expected puzzle to be 81 characters long' });

      let solvedString = solver.solve(puzzleString);

      if(solvedString == "")
        return res.json({ error: 'Puzzle cannot be solved' });

      res.json({solution : solvedString});
    });
};
