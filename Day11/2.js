const puzzle = require('./puzzle');

function processInput(data) {
    const simulation = new puzzle.Simulation(data);

    const day = simulation.findFirstSimultaneuosFlash(); 
    console.log(`Answer: ${day}`);
}

module.exports = { processInput };