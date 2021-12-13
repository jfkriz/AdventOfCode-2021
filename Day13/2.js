const puzzle = require('./puzzle');

function processInput(data) {
    const paper = new puzzle.Paper(data);

    while(paper.nextFold());
    console.log('Answer:');
    console.log(paper.toString());
}

module.exports = { processInput };