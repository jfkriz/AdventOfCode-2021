const os = require('os');

class Notebook {
    constructor(data) {
        this.entries = data.map(line => new NotebookEntry(line));
    }

    countUniqueOutputDigits(includeDigits) {
        return this.entries.map(e => e.outputValueDigits.filter(d => includeDigits.includes(d)).length).sum();
    }

    sumOutputValues() {
        return this.entries.map(e => e.outputValueNumber).sum();
    }

    toString() {
        return this.entries.map((entry, index) => `${(index + 1).toString().padStart(3)}: ${entry.toString()}`).join(os.EOL);
    }
}

class NotebookEntry {
    constructor(line) {
        const parts = line.split(' | ');
        this._wireMap = new WireMap(parts[0]);
        this.signal = parts[0].split(' ').map(p => p.split('').sort().join('')).join(' ');
        this.outputValue = parts[1].split(' ').map(p => p.split('').sort().join('')).join(' ');

        this.outputValueDigits = parts[1].split(' ').map(n => this._wireMap.getDigit(n));
        this.outputValueNumber = parseInt(this.outputValueDigits.join(''));
    }

    toString() {
        return `${this.signal} | ${this.outputValue} : ${this.outputValueDigits.join('')}`;
    }
}

class WireMap {
    constructor(signal) {
        const wires = new Array(10);
        const signalDigits = signal.split(' ').map(d => d.split('').sort());

        // For Part One - we only care about the digits that have a unique number of segments (1, 4, 7, 8) - those are easy to identify
        wires[1] = signalDigits.find(d => d.length == 2);
        wires[4] = signalDigits.find(d => d.length == 4);
        wires[7] = signalDigits.find(d => d.length == 3);
        wires[8] = signalDigits.find(d => d.length == 7);

        // For Part Two, we need to inspect each of the patterns in the signal, in context with the others, to determine the remaining digits

        /// Patterns w/length 6 (6, 9, 0)
        // --------------------------------------------------------------------------------

        // Number 6 is the pattern that has 6 segments, and only has one of the segments in number 1
        wires[6] = signalDigits.find(d => d.length == 6 && d.filter(w => wires[1].includes(w)).length == 1);
        // console.log(`6: ${wires[6]}`);

        // Number 9 is the pattern with 6 segments, and has at least all the same segments as number 4 (just missing the top horizontal segment)
        wires[9] = signalDigits.find(d => d.length == 6 && wires[4].every(w => d.includes(w)));
        // console.log(`9: ${wires[9]}`);

        // Number 0 is the pattern with 6 segments, but is NOT number 6 or 9 (which we already determined above)
        wires[0] = signalDigits.find(d => 
            d.length == 6 
            && !wires[9].every(w => d.includes(w))
            && !wires[6].every(w => d.includes(w))
        );
        // console.log(`0: ${wires[0]}`);

        // Patterns with length 5 (3, 5, 2)
        // --------------------------------------------------------------------------------

        // Number 3 is the pattern with 5 segments, and has both segments from number 1
        wires[3] = signalDigits.find(d => d.length == 5 && wires[1].every(w => d.includes(w)));
        // console.log(`3: ${wires[3]}`);

        // The top right vertical segment will help us differentiate 2 from 5 - those are tricky otherwise!
        // The top right vertical is found by looking at number 6 (determined above) and seeing which of 
        // the right vertical segments is missing (by comparing to number 1)
        const topRight = wires[1].find(w => !wires[6].includes(w));

        // Ok, we now know top right vertical, so number 5 is the pattern with length of 5, and is missing the top right segment
        wires[5] = signalDigits.find(d => d.length == 5 && !d.includes(topRight));
        // console.log(`5: ${wires[5]}`);

        // Process of elimination here, number 2 is the pattern with length of 5, but is NOT number 3 or 5
        wires[2] = signalDigits.find(d => 
            d.length == 5
            && !wires[3].every(w => d.includes(w))
            && !wires[5].every(w => d.includes(w))
        );
        // console.log(`2: ${wires[2]}`);

        // To make it easy for later comparisons, we'll sort each pattern alphabetically (maybe should have done that earlier...)
        this._wirePatterns = wires.map(w => w.sort().join(''));
    }

    getDigit(pattern) {
        let patternSorted = pattern.split('').sort().join('');
        for (let i = 0; i < this._wirePatterns.length; i++) {
            if (patternSorted == this._wirePatterns[i]) {
                return i;
            }
        }

        return NaN;
    }

    toString() {
        return JSON.stringify(this._wirePatterns.reduce((prev, curr, ix) => { prev[ix] = curr; return prev; }, {}), null, '  ');
    }
}

module.exports = { Notebook };