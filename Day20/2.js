const puzzle = require('./puzzle');

function processInput(data) {
    const processor = new puzzle.ImageProcessor(data);
    console.log('Initial Image:');
    console.log(processor.image.toString());

    console.log('Enhanced Image:');
    const enhanced = processor.enhance(50);
    console.log(enhanced.toString());

    console.log(`Answer: ${enhanced.litPixels}`);
}

module.exports = { processInput };
