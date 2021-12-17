const puzzle = require('./puzzle');

function processInput(data) {
    const solver = new puzzle.Solver(data);
    let result = solver.solve();
    console.log(`Answer: ${result}`);
}

module.exports = { processInput };