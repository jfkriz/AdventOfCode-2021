const puzzle = require('./puzzle');

function processInput(data) {
    const launcher = new puzzle.ProbeLauncher(data[0]);
    console.log(`Probe Launcher Target: ${launcher}`);

    const result = launcher.trickShotHighestApex();
    console.log(`Trick Shot Result: ${result}`);
    console.log(`Answer: ${result.apex.y}`);
}

module.exports = { processInput };