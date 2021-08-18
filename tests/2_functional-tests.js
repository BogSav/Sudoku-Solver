const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const PuzzleStrings = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;

chai.use(chaiHttp);

suite('Functional Tests', () => {
  
  suite('API calls to /api/solve ==> POST', () => {

    test('Solve a puzzle with valid puzzle string', done => {
      chai.request(server)
        .post('/api/solve')
        .send({puzzle : PuzzleStrings[0][0]})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isDefined(res.body);
          assert.isObject(res.body);
          assert.property(res.body, 'solution');
          assert.strictEqual(res.body.solution, PuzzleStrings[0][1]);
          done();
        });
    });

    test('Solve a puzzle with missing puzzle string', done => {
      chai.request(server)
        .post('/api/solve')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isDefined(res.body);
          assert.isObject(res.body);
          assert.deepEqual(res.body, { error: 'Required field missing' });
          done();
        });
    });

    test('Solve a puzzle with invalid characters', done => {
      chai.request(server)
        .post('/api/solve')
        .send({puzzle : "234.23.42.42.4.asdfasdfa*sg"})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isDefined(res.body);
          assert.isObject(res.body);
          assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
          done();
        });
    });

    test('Solve a puzzle with incorrect length', done => {
      chai.request(server)
        .post('/api/solve')
        .send({puzzle : "2.23..2.1.2.312.31.5...74..4.64.6"})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isDefined(res.body);
          assert.isObject(res.body);
          assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
          done();
        });
    });

    test('Solve a puzzle that cannot be solved', done => {
      chai.request(server)
        .post('/api/solve')
        .send({puzzle : "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isDefined(res.body);
          assert.isObject(res.body);
          assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
          done();
        });
    });  
  });

  suite('API calls to /api/check ==> POST', () => {

    let testString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

    test('Check a puzzle placement with all fields', done => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle : testString,
          coordinate : 'A1',
          value : 7
          })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isDefined(res.body);
          assert.isObject(res.body);
          assert.property(res.body, 'valid');
          assert.strictEqual(res.body.valid, true);
          done();
        });
    });

    test('Check a puzzle placement with single placement conflict', done => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle : testString,
          coordinate : 'A1',
          value : 6
          })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isDefined(res.body);
          assert.isObject(res.body);
          assert.property(res.body, 'valid');
          assert.property(res.body, 'conflict');
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict.length, 1);
          assert.deepEqual(res.body, {valid : false, conflict : ['column']});
          done();
        });
    });

    test('Check a puzzle placement with multiple placement conflicts', done => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle : testString,
          coordinate : 'A1',
          value : 1
          })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isDefined(res.body);
          assert.isObject(res.body);
          assert.property(res.body, 'valid');
          assert.property(res.body, 'conflict');
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict.length, 2);
          assert.strictEqual(res.body.valid, false);
          assert.include(res.body.conflict, 'row');
          assert.include(res.body.conflict, 'column');
          done();
        });
    });

    test('Check a puzzle placement with all placement conflicts', done => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle : testString,
          coordinate : 'A1',
          value : 5
          })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isDefined(res.body);
          assert.isObject(res.body);
          assert.property(res.body, 'valid');
          assert.property(res.body, 'conflict');
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict.length, 3);
          assert.strictEqual(res.body.valid, false);
          assert.include(res.body.conflict, 'row');
          assert.include(res.body.conflict, 'column');
          assert.include(res.body.conflict, 'region');
          done();
        });
    });

    test('Check a puzzle placement with missing required fields', done => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle : testString,
          value : 5
          })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isDefined(res.body);
          assert.isObject(res.body);
          assert.deepEqual(res.body, { error: 'Required field(s) missing' });
          done();
        });
    });

    test('Check a puzzle placement with invalid characters', done => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle : "..234.2.423.4.a..234.234.23.42.4",
          coordinate : 'A1',
          value : 5
          })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isDefined(res.body);
          assert.isObject(res.body);
          assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
          done();
        });
    });

    test('Check a puzzle placement with incorrect length', done => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle : "..234.2.423.4.4..234.234.23.42.4",
          coordinate : 'A1',
          value : 5
          })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isDefined(res.body);
          assert.isObject(res.body);
          assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
          done();
        });
    });

    test('Check a puzzle placement with invalid placement coordinate', done => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle : testString,
          coordinate : 'r1',
          value : 5
          })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isDefined(res.body);
          assert.isObject(res.body);
          assert.deepEqual(res.body, { error: 'Invalid coordinate'});
          done();
        });
    });

    test('Check a puzzle placement with invalid placement value', done => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle : testString,
          coordinate : 'A1',
          value : 'X'
          })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isDefined(res.body);
          assert.isObject(res.body);
          assert.deepEqual(res.body, { error: 'Invalid value' });
          done();
        });
    });
  });
});

