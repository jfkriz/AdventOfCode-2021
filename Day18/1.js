const puzzle = require('./puzzle');

function processInput(data) {
    const homework = new puzzle.SnailfishHomework(data);
    let sum = homework.sum();
    console.log(`Sum: ${sum}`);
    let magnitude = homework.magnitude(sum);
    console.log(`Answer: ${magnitude}`);
}

module.exports = { processInput };