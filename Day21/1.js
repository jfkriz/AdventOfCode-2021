const puzzle = require('./puzzle');

function processInput(data) {
    const game = new puzzle.DiceGame(data, 100);
    const result = game.playDeterministic();

    console.log(`Answer: ${result}`);
}

module.exports = { processInput };
