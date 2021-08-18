const chai = require('chai');
const assert = chai.assert;

const PuzzleStrings = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;
const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {

  suite('Puzzle validation tests', () => {

    test('Logic handles a valid puzzle string of 81 characters', (done) => {
      let result = solver.solve(PuzzleStrings[0][0]);
      assert.isNotBoolean(result);
      done();
    });

    test('Logic handles a puzzle string with invalid characters', (done) => {
      let testString = "1.5..2.84..63.12.7.2..5.....9..1.a..8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      let result = solver.solve(testString);
      assert.isBoolean(result);
      assert.strictEqual(solver.validate(testString), false);
      done();
    });

    test('Logic handles a puzzle string that is not 81 characters in length', done => {
      let testString = "1.5..2.84..63.12...5.....9..1.a..8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      let result = solver.solve(testString);
      assert.isBoolean(result);
      assert.strictEqual(solver.validateLength(testString), false);
      done();
    })
  });

  suite('Value placement tests', () => {
    
    let testString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..".split("");

    test("Logic handles a valid row placement", done => {
      assert.strictEqual(solver.checkRowPlacement(testString, 0, 0, 6), true);
      done();
    });

    test("Logic handles an invalid row placement", done => {
      assert.strictEqual(solver.checkRowPlacement(testString, 0, 0, 9), false);
      done();
    });

    test("Logic handles a valid column placement", done => {
      assert.strictEqual(solver.checkColPlacement(testString, 0, 0, 6), false);
      done();
    });
    
    test("Logic handles an invalid column placement", done => {
      assert.strictEqual(solver.checkColPlacement(testString, 0, 0, 9), true);
      done();
    });

    test("Logic handles a valid region placement", done => {
      assert.strictEqual(solver.checkRegionPlacement(testString, 0, 0, 2), false);
      done();
    });
    
    test("Logic handles an invalid region placement", done => {
      assert.strictEqual(solver.checkRegionPlacement(testString, 0, 0, 1), true);
      done();
    });
  });

  suite('Puzzle solve tests', () => {
    
    test('Valid puzzle strings pass the solver', done => {
      assert.isString(solver.solve(PuzzleStrings[0][0]));
      done();
    });

    test('Invalid puzzle strings fail the solver', done => {
      assert.isNotString(solver.solve('adfasdfasfasdfaf...2345.2.42.42.4.234'));
      done();
    });

    test('Solver returns the expected solution for an incomplete puzzle', done => {
      PuzzleStrings.forEach(puzzle => {
        assert.strictEqual(solver.solve(puzzle[0]), puzzle[1]);
      });
      done();
    });
  });
});
