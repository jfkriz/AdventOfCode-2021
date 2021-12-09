const puzzle = require('./puzzle');
function processInput(data) {
    const notebook = new puzzle.Notebook(data);
    console.log(notebook.toString());

    console.log(`Answer: ${notebook.countUniqueOutputDigits([1, 4, 7, 8])}`);
}

module.exports = { processInput };