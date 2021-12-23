const puzzle = require('./puzzle');

function processInput(data) {
    const reactor = new puzzle.Reactor(data);
    let result = reactor.reboot();
    console.log(`Answer: ${result}`);
}

module.exports = { processInput };
