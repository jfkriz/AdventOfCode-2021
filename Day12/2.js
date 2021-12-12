const puzzle = require ('./puzzle');
const os = require('os');

function processInput(data) {
    const graph = new puzzle.CaveGraph(data);
    const allPaths = graph.findAllPaths(true);

    console.log(`All Paths:${os.EOL}${allPaths.join(os.EOL)}`);

    console.log(`Answer: ${allPaths.length}`);
}

module.exports = { processInput };