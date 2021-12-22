const puzzle = require('./puzzle');

function processInput(data) {
    const game = new puzzle.QuantumDiceGame(data, 3);
    const result = game.play();
    console.log(`Answer: ${result}`);
}

module.exports = { processInput };
