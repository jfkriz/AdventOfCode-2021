const puzzle = require('./puzzle');
const os = require('os');

function processInput(data) {
    const launcher = new puzzle.ProbeLauncher(data[0]);
    console.log(`Probe Launcher Target: ${launcher}`);

    const result = launcher.allPossibleHits();
    console.log(result.map(r => r.toString()).join(os.EOL));
    console.log(`Answer: ${result.length}`);
}

module.exports = { processInput };