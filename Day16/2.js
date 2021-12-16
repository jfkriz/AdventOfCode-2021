const puzzle = require('./puzzle');

function processInput(data) {
    let decoder = new puzzle.PacketDecoder(data[0]);
    let result = decoder.packet.value;
    console.log(`Answer: ${result}`);
}

module.exports = { processInput };