const bingo = require('./bingo.js')

function processInput(data) {
    const game = new bingo.Game(data);

    const lastWinner = game.playAll();
    console.log(`Last Winner: ${lastWinner ? lastWinner.toString() : none}`);

    console.log(`Sum of unmarked numbers: ${lastWinner.sumUnmarkedNumbers()}, Last number called: ${lastWinner.lastMarkedNumber}, Answer: ${lastWinner.sumUnmarkedNumbers() * lastWinner.lastMarkedNumber}`)
}

module.exports = { processInput };