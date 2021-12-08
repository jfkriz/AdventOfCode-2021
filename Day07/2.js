const crab = require('./crab');

function processInput(data) {
    const simulation = new crab.Simulation(data[0], false);

    const answer = simulation.run();

    console.log(`Least fuel used is ${answer.fuel} at position ${answer.position}`);
}

module.exports = { processInput };