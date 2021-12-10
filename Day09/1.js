const puzzle = require('./puzzle');
const os = require('os');

function processInput(data) {
    const smokeMap = new puzzle.SmokeMap(data);

    const lowPoints = smokeMap.findLowPoints();
    console.log(`Low Points:${os.EOL}${lowPoints.map(p => p.toString()).join(os.EOL)}`);

    console.log(`Answer: ${lowPoints.map(p => p.height + 1).sum()}`);
}

module.exports = { processInput };