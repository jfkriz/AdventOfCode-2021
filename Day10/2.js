const parser = require('./parser');
const os = require('os');

function processInput(data) {
    const lines = data.map(line => new parser.InputLine(line));

    const scoreMap = {
        ')': 1,
        ']': 2,
        '}': 3,
        '>': 4
    };

    const completions = lines.filter(l => !l.isCorrupt()).map(l => l.findCompletion());
    console.log(completions.join(os.EOL));

    const scores = completions.map(c => c.split('').map(n => scoreMap[n]).reduce((a, b) => (5 * a) + b, 0)).sort((a, b) => a - b);
    console.log(scores.join(os.EOL));

    console.log(`Answer: ${scores[Math.round(scores.length / 2) - 1]}`);
}

module.exports = { processInput };