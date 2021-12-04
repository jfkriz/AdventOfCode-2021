function processInput(data) {
    const bitMatrix = data.map(line => line.split(''));

    const o2GeneratorRating = filterCommon(bitMatrix, 0, true)[0];
    const o2GeneratorRatingDecimal = parseInt(o2GeneratorRating.join(''), 2);
    const co2ScrubberRating = filterCommon(bitMatrix, 0, false)[0];
    const co2ScrubberRatingDecimal = parseInt(co2ScrubberRating.join(''), 2);

    console.log(`O2 Generator Rating: ${o2GeneratorRating.join('')} (${o2GeneratorRatingDecimal}), CO2 Scrubber Rating: ${co2ScrubberRating.join('')} (${co2ScrubberRatingDecimal}), Answer: ${o2GeneratorRatingDecimal * co2ScrubberRatingDecimal}`);
}

function filterCommon(matrix, bitPosition, mostCommon) {
    const bitPositionCount = {0: 0, 1: 0};
    matrix.forEach(line => bitPositionCount[line[bitPosition]]++);

    const selectedBit = mostCommon ? (bitPositionCount[1] >= bitPositionCount[0] ? 1 : 0) : (bitPositionCount[0] <= bitPositionCount[1] ? 0 : 1);
    const filtered = matrix.filter(line => line[bitPosition] == selectedBit);

    return filtered.length == 1 ? filtered : filterCommon(filtered, ++bitPosition, mostCommon)
}

module.exports = { processInput };