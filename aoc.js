#!/usr/local/bin/node
const fs = require('fs');
const os = require('os');
const path = require('path');

// Some helpful prototype extensions that I find myself writing over and over in each day's solutions
require('./util/extensions');

function main(args) {
    if (args.length < 2) {
        console.warn(`Usage: node ${path.basename(__filename)} DayNumber ChallengeNumber [InputFileName]
        Where DayNumber is the day number, like "1" for Day01, and ChallengeNumber is the challenge number, typically "1" or "2".
        You can optionally specify an InputFileName (just the file name, it will look for the file in the Day directory), but it will default to a file named "input.txt" in the Day solution directory.`);
        process.exit(1);
    }

    const day = `Day${args[0].padStart(2, '0')}`;
    const challenge = `${args[1]}.js`;
    const processor = require(path.resolve(__dirname, day, challenge));

    try {
        const inputFile = path.resolve(__dirname, day, args.length > 2 ? args[2] : 'input.txt');

        const data = fs.readFileSync(inputFile, 'utf8').split(os.EOL);
        processor.processInput(data);
    } catch (e) {
        console.error(e);
    }

}

main(process.argv.slice(2));
