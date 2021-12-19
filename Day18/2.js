const puzzle = require('./puzzle');

function processInput(data) {
    const homework = new puzzle.SnailfishHomework(data);
    let greatestMagnitude = homework.greatestMagnitude();
    console.log(`Answer: ${greatestMagnitude}`);
}

module.exports = { processInput };