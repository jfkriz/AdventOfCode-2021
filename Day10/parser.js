class InputLine {
    constructor(line) {
        this._open = '([{<'.split('');
        this._close = ')]}>'.split('');

        this._parsed = this._parse(line).split('');
    }

    /**
     * This is really not "parsing" the input - it is just removing all empty pairs of matched open/close delimiters,
     * then checking to see if there are any remaining, then looping again to replace, and so on, until
     * there are no more empty matching pairs. At that point, the line is "corrupt" if there are any remaining
     * closing characters, otherwise all that remains are opening characters, and it is considered "incomplete".
     */
    _parse(input) {
        const emptyPairs = this._open.map((o, i) => `${o}${this._close[i]}`);

        let parsed = input;
        while (emptyPairs.reduce((a, b) => a + (parsed.includes(b) ? 1 : 0), 0) > 0) {
            emptyPairs.forEach(n => parsed = parsed.replace(n, ''));
        }

        return parsed;
    }

    /**
     * Assuming the line is determined to not be corrupt (!isCorrupt()), find the completion of the "incomplete"
     * line by reversing the value from _parse() (should only be opening characters), then return a string of 
     * the closing characters corresponding to each of the reversed opening characters.
     */
    findCompletion() {
        if (this.isCorrupt()) {
            return undefined;
        }

        return this._parsed.reverse().map(n => this._close[this._open.indexOf(n)]).join('');
    }

    /**
     * Assuming the line is determined to be corrupt (isCorrupt()), look for the first closing character 
     * in the output from _parse().
     */
    findFirstIllegalCharacter() {
        if (!this.isCorrupt()) {
            return undefined;
        }

        const illegalIndex = this._parsed.findIndex(c => this._close.includes(c));
        return new IllegalCharacter(this._parsed[illegalIndex], this._close[this._open.indexOf(this._parsed[illegalIndex-1])]);
    }

    /**
     * With the output from _parse(), check to see if there are any remaining closing characters. If there
     * are, this means there was an unbalanced open/close pair in the string, and it is corrupt.
     */
    isCorrupt() {
        return this._parsed.findIndex(c => this._close.includes(c)) >= 0;
    }
}

class IllegalCharacter {
    constructor(char, shouldBe) {
        this.char = char;
        this.shouldBe = shouldBe;
    }

    toString() {
        return `Expected ${this.shouldBe}, but found ${this.char} instead.`;
    }
}

module.exports = { InputLine }