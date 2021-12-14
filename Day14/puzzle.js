class Polymer {
    constructor(lines) {
        this.template = lines[0];
        this.insertionRules = lines.slice(2).map(line => line.split(' -> ')).reduce((a, b) => {
            a[b[0]] = b[1];
            return a;
        }, {});
    }

    processRules(steps) {
        for(let i = 0; i < steps; i++) {
            let templateChars = this.template.split('');
            let result = [];
            templateChars.forEach((char, c) => {
                result.push(char);
                if (c + 1 < templateChars.length) {
                    let nextChar = templateChars[c + 1];
                    let pair = `${char}${nextChar}`;
                    let insertion = this.insertionRules[pair];
                    if (insertion !== undefined) {
                        result.push(insertion);
                    }
                }
            });
    
            this.template = result.join('');
        }

        return this._characterCounts(this.template);
    }

    _characterCounts(val) {
        return val.split('').reduce((a, b) => {
            a[b] = (a[b] || 0) + 1;
            return a;
        }, {})
    }

    /**
     * Rather than building the entire string (which will require over 1TB of memory, I think...), just keep track
     * of how many pairs and characters exist in each iteration. Start by getting a count of each character and each pair
     * in the initial template, then for each step iteration, loop over all the insertion rules, and capture the
     * current pairs that would be incremented, and the characters that would be incremented. Keep a running total of
     * character and pair counts for the next iteration.
     */
    processRulesOptimized(steps) {
        let charCounts = this._characterCounts(this.template);

        let pairOccurrences = {};
        for (let i = 0; i < this.template.length - 1; i++) {
            const pair = this.template.substring(i, i + 2);
            pairOccurrences[pair] = (pairOccurrences[pair] || 0) + 1;
        }

        for (let i = 0; i < steps; i++) {
            Object.entries(this.insertionRules).reduce((a, [pair, char]) => {
                if (pairOccurrences[pair] !== undefined) {
                    a.push(new Inserted(pair, char, pairOccurrences[pair]));
                    pairOccurrences[pair] = undefined;
                }
                return a;
            }, []).forEach(inserted => {
                charCounts[inserted.char] = (charCounts[inserted.char] || 0) + inserted.count;
                pairOccurrences[inserted.leftPair] = (pairOccurrences[inserted.leftPair] || 0) + inserted.count;
                pairOccurrences[inserted.rightPair] = (pairOccurrences[inserted.rightPair] || 0) + inserted.count;
            });
        }

        return charCounts;
    }
}

class Inserted {
    constructor(pair, insertedChar, count) {
        this.pair = pair;
        this.char = insertedChar;
        this.count = count;

        this.leftPair = `${pair.charAt(0)}${insertedChar}`;
        this.rightPair = `${insertedChar}${pair.charAt(1)}`;
    }
}

module.exports = { Polymer };