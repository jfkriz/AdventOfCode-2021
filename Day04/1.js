const bingo = require('./bingo.js')

function processInput(data) {
    const game = new bingo.Game(data);

    const winner = game.play();
    console.log(`Winner: ${winner ? winner.toString() : none}`);

    console.log(`Sum of unmarked numbers: ${winner.sumUnmarkedNumbers()}, Last number called: ${game.lastNumberCalled}, Answer: ${winner.sumUnmarkedNumbers() * game.lastNumberCalled}`)
}

module.exports = { processInput };