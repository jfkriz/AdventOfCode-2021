function processInput(data) {
    // Split each input line into the individual bits, then transpose the array so each row
    // has all the bits in the corresponding position (row 1 has all the first bits, row 2 has all the second, etc)
    let transposed = data.map(line => line.split('').map(bit => parseInt(bit))).reduce((prev, next) => next.map((_, i) =>
        (prev[i] || []).concat(next[i])
    ), []);

    // Now that we've transposed the array, find the most common bit in each row
    let gammaRate = transposed.map(bits => bits.sort((a, b) => bits.filter(v => v === a).length - bits.filter(v => v === b).length).pop());
    let gammaRateDecimal = parseInt(gammaRate.join(''), 2);
    let epsilonRate = gammaRate.map(bit => bit == 0 ? 1 : 0);
    let epsilonRateDecimal = parseInt(epsilonRate.join(''), 2);

    console.log(`Gamma Rate: ${gammaRate.join('')} (${gammaRateDecimal}), Epsilon Rate: ${epsilonRate.join('')} (${epsilonRateDecimal}), Answer: ${gammaRateDecimal * epsilonRateDecimal}`);
}

module.exports = { processInput };