const puzzle = require('./puzzle');

function processInput(data) {
    let decoder = new puzzle.PacketDecoder(data[0]);
    let result = decoder.packet.allPackets.map(p => p.version).sum();
    console.log(`Answer: ${result}`);
}

module.exports = { processInput };