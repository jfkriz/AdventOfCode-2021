const puzzle = require('./puzzle');
const os = require('os');

function processInput(data) {
    const smokeMap = new puzzle.SmokeMap(data);

    const basins = smokeMap.findBasins();
    console.log(`Basins:${os.EOL}${basins.map((b, i) => `Basin ${i.toString().padStart(3, ' ')} -- ${b}`).join(os.EOL)}`);

    const basinCounts = basins.map(b => b.size);
    console.log(`Basin counts: ${basinCounts.join(',')}`);

    const topThree = basinCounts.sort((a, b) => b - a).slice(0, 3);
    console.log(`3 largest: ${topThree.join(',')}`);

    console.log(`Answer: ${topThree.multiply()}`);
}

module.exports = { processInput };