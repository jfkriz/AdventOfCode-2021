const os = require('os');

class ImageProcessor {
    #algorithm;
    #image;
    #fill;
    constructor(data) {
        this.#algorithm = data[0].split('').map(b => (b == '#' ? 1 : 0));

        this.#image = new Image(data.slice(2));

        this.#fill = 0;
    }

    enhance(steps) {
        for (let step = 0; step < steps; step++) {
            const height = this.#image.height;
            const width = this.#image.width;

            const newImage = [];

            // On each step, expand the image by 3 in all directions, then process each character,
            // filling in the expanded area with the `fill` value (0 or 1).
            for (let y = -3; y < height + 3; y++) {
                const row = [];
                for (let x = -3; x < width + 3; x++) {
                    let surrounding = this.#image.getSurrounding(
                        x,
                        y,
                        this.#fill
                    );
                    row.push(this.#getInstruction(surrounding));
                }
                newImage.push(row);
            }
            this.#image = new Image(newImage);

            // This was tricky! When "infinitely" expanding the image canvas, we need to alternate expanding
            // with 0 or 1 if the input algorithm has a 1 at the start or a 0 at the end. I honestly am not
            // 100% sure why this is the case, and the test input worked fine always filling with 0. I tried
            // swapping back and forth between 0 and 1, but then the real input worked, but the test was broken...
            // What I noticed with the real input was that without swapping, the image would alternate between
            // a "negative" image and a "positive" one, and as it grew, a border of lit pixels was forming around
            // the outside as well. It took me a while of looking at the algorithm between the two (and also trying
            // different things with the test data), and lots of debugger breakpoints before I finally came to this.
            // I really have no idea if this is universally correct though - it works for my input, and for the
            // test input, but I'd be interested to se if this works for other inputs.
            if (this.#fill == 0 && this.#algorithm[0] == 1) {
                this.#fill = 1;
            } else if (this.#fill == 1 && this.#algorithm.at(-1) == 0) {
                this.#fill = 0;
            }
        }

        return this.#image;
    }

    #getInstruction(surrounding) {
        return this.#algorithm[
            parseInt(surrounding.map(b => b.toString()).join(''), 2)
        ];
    }

    get image() {
        return this.#image;
    }
}

class Image {
    #imageData;
    constructor(data) {
        this.#imageData = data.map(line =>
            // Since we're creating a `new Image()` each step while enhancing,
            // this supports a string of '#' and '.' (from the input file), or
            // an array of 0s and 1s from a previously enhanced image.
            Array.isArray(line)
                ? line
                : line.split('').map(col => (col === '#' ? 1 : 0))
        );
    }

    get height() {
        return this.#imageData.length;
    }

    get width() {
        return this.#imageData[0].length;
    }

    get litPixels() {
        return this.#imageData.flat().sum();
    }

    #at(x, y, fill) {
        return x < 0 || x >= this.width || y < 0 || y >= this.height
            ? fill
            : this.#imageData[y][x];
    }

    getSurrounding(x, y, fill) {
        return [
            // Row above current
            this.#at(x - 1, y - 1, fill),
            this.#at(x, y - 1, fill),
            this.#at(x + 1, y - 1, fill),
            // Current row
            this.#at(x - 1, y, fill),
            this.#at(x, y, fill),
            this.#at(x + 1, y, fill),
            // Row below current
            this.#at(x - 1, y + 1, fill),
            this.#at(x, y + 1, fill),
            this.#at(x + 1, y + 1, fill),
        ];
    }

    toString() {
        return this.#imageData
            .map(row => row.map(col => (col === 1 ? '#' : '.')).join(''))
            .join(os.EOL);
    }
}

module.exports = { ImageProcessor };
