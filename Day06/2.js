const fish = require('./fish.js')

function processInput(data) {
    const simulation = new fish.SimulationOptimized(256, data);

    const numFish = simulation.run();

    console.log(`Answer: ${numFish} fish after ${simulation.days} days`);
}

module.exports = { processInput };