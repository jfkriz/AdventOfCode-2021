const puzzle = require('./puzzle');
function processInput(data) {
    const notebook = new puzzle.Notebook(data);
    console.log(notebook.toString());

    console.log(`Answer: ${notebook.sumOutputValues()}`);
}

module.exports = { processInput };