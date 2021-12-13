const puzzle = require('./puzzle');

function processInput(data) {
    const paper = new puzzle.Paper(data);

    //console.log('Before folds');
    //console.log(paper.toString());

    paper.nextFold();
    const answer = paper.countDots();

    console.log(`Answer: ${answer}`);
}

module.exports = { processInput };