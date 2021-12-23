const puzzle = require('./puzzle');

function processInput(data) {
    const reactor = new puzzle.Reactor(data);
    let result = reactor.initialize(
        new puzzle.Range(-50, 50),
        new puzzle.Range(-50, 50),
        new puzzle.Range(-50, 50)
    );
    console.log(`Answer: ${result.total}`);
}

module.exports = { processInput };
