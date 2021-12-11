const puzzle = require('./puzzle');

function processInput(data) {
    const simulation = new puzzle.Simulation(data);

    const totalFlashes = simulation.runSimulation(100); 
    console.log(`Answer: ${totalFlashes}`);
}

module.exports = { processInput };