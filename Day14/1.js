const puzzle = require('./puzzle');

function processInput(data) {
    const polymer = new puzzle.Polymer(data);

    let counts = polymer.processRules(10);
    console.log(JSON.stringify(counts, null, '  '));

    const greatest = Math.max(...Object.values(counts));
    const least = Math.min(...Object.values(counts));

    let result = greatest - least;
    console.log(`Answer: ${result}`);
}

module.exports = { processInput };