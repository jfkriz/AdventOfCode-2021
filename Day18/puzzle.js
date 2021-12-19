const os = require("os");

/**
 * I tried really hard to do this with a Tree-like structure, but it got way too hard to
 * process the `explode` in a tree. Also tried just nested arrays, but that was also very
 * difficult. I'm sure I'm missing something, but the easiest solution I could come up with
 * was to parse the input character by character (converting numbers to ints along the way),
 * and then process the rules on the array of characters & numbers, looking forward and
 * backward in the array when an explode occurred.
 */
class SnailfishHomework {
    #input;
    constructor(data) {
        this.#input = data
            .map(s => s.replaceAll(",", "")) // Get rid of commas (input only has single-digit numbers, so this works...)
            .map(s => s.split("").map(s => (isNaN(s) ? s : parseInt(s)))); // Split each line into an array of characters, with numbers converted to ints
    }

    sum() {
        return this.#input
            .slice(1)
            .reduce((a, b) => this.#sum(a, b), [this.#input[0]]);
    }

    magnitude(n) {
        for (let i = 0; i < n.length; i++) {
            const currentChar = n[i];
            if (currentChar == "]") {
                let tmp = n.splice(i - 3, 4);
                let sum = tmp[1] * 3 + tmp[2] * 2;
                n.splice(i - 3, 0, sum);
                i -= 3;
            }
        }
        return n[0];
    }

    greatestMagnitude() {
        let greatest = 0;
        this.#input.forEach(a => {
            this.#input
                .filter(b => a !== b)
                .forEach(b => {
                    let mag = this.magnitude(this.#sum(a, b));
                    greatest = Math.max(mag, greatest);
                });
        });
        return greatest;
    }

    #sum(a, b) {
        let total = ["[", ...a, ...b, "]"];
        while (this.#explode(total) || this.#split(total));

        return total;
    }

    #explode(n) {
        let numOpen = 0;
        for (let i = 0; i < n.length; i++) {
            const currentChar = n[i];
            if (currentChar == "[") {
                numOpen++;
            } else if (currentChar == "]") {
                numOpen--;
            }

            if (numOpen == 5) {
                let removed = n.splice(i, 4);
                let right = i - 1;
                let left = i;
                while (left-- > 0) {
                    if (!isNaN(n[left])) {
                        n[left] += removed[1];
                        break;
                    }
                }
                while (right++ < n.length) {
                    if (!isNaN(n[right])) {
                        n[right] += removed[2];
                        break;
                    }
                }
                n.splice(i, 0, 0);
                this.#explode(n);
                return true;
            }
        }
        return false;
    }

    #split(n) {
        for (let i = 0; i < n.length; i++) {
            const currentChar = n[i];
            if (!isNaN(currentChar) && currentChar > 9) {
                let left = Math.floor(currentChar / 2);
                let right = Math.ceil(currentChar / 2);
                let replaced = ["[", left, right, "]"];
                n.splice(i, 1, ...replaced);
                return true;
            }
        }
        return false;
    }
}

module.exports = { SnailfishHomework };
