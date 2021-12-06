const vents = require('./vents.js')
const os = require('os');

function processInput(data) {
    const v = data.map(line => new vents.Vent(line));

    let points = {};
    v.map(vent => vent.getPoints()).flat().forEach(p => {
        let key = p.toString();
        points[key] = points[key] ? points[key] += 1 : 1;
    });

    const riskyPoints = Object.entries(points).filter(entry => entry[1] > 1).map(entry => new vents.Point(entry[0]));

    // console.log(`Risky Points:${os.EOL}${riskyPoints.map(p => p.toString()).join(os.EOL)}`);
    console.log(`Answer: ${riskyPoints.length}`);
}

module.exports = { processInput };