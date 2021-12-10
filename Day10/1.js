const parser = require('./parser');

function processInput(data) {
    const lines = data.map(line => new parser.InputLine(line));

    // 2, 4, 5, 7, 8 are not corrupt in test input
    lines.forEach((input, index) => {
        console.log(`Line ${index} parsed = ${input.parsed}; corrupt? ${input.isCorrupt()}`);
    });

    const scoreMap = {
        ')': 3,
        ']': 57,
        '}': 1197,
        '>': 25137
    };

    const illegalChars = lines.filter(l => l.isCorrupt()).map(l => l.findFirstIllegalCharacter());
    illegalChars.forEach(c => console.log(`${c}`));

    
    const result = illegalChars.map(c => scoreMap[c.char]).sum();
    console.log(`Answer: ${result}`);
}

module.exports = { processInput };