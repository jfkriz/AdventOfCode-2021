const puzzle = require('./puzzle');

function processInput(data) {
    const caveMap = new puzzle.CaveMap(data, 5);

    const risk = caveMap.findLeastRiskyPath();
    console.log(`Answer: ${risk}`);
}

module.exports = { processInput };