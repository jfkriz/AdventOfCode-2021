const os = require('os');

class Paper {
    constructor(lines) {
        const points = [];
        this.foldInstructions = [];

        let doneWithPoints = false;
        let height = 0;
        let width = 0;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().length == 0) {
                doneWithPoints = true;
                i++;
            }

            if (doneWithPoints) {
                this.foldInstructions.push(new FoldInstruction(lines[i]));
            } else {
                const [x, y] = lines[i].split(',').map(p => parseInt(p));
                height = y > height ? y : height;
                width = x > width ? x : width;
                points.push([x, y]);
            }
        }

        this.matrix = new Array(height + 1).fill().map(() => new Array(width + 1).fill(false));
        points.forEach(([x, y]) => {
            this.matrix[y][x] = true;
        });
    }

    countDots() {
        return this.matrix.flat().filter(c => c).length;
    }

    nextFold() {
        if (this.foldInstructions.length == 0) {
            return false;
        }

        const fold = this.foldInstructions.shift();
        if (fold.orientation == 'vertical') {
            this._foldLeft(fold.axis);
        } else {
            this._foldUp(fold.axis);
        }

        return true;
    }

    /**
     * This works, but is not very elegant. It does the following:
     * 1. Split the current matrix into "top" and "bottom" chunks along the given horizontal line
     * 2. Reverse the order of the bottom half (Array.reverse()) to simulate the "fold up"
     * 3. If there are more rows in the bottom half than the top half, assume those rows are lost
     *    after the fold, so get rid of them (as if we used scissors to cut those rows off the top
     *    of the paper)
     * 4. Reverse of #3, if there are more rows in the top half than the bottom half, add empty
     *    rows to the top of the bottom half (as if we taped paper onto the bottom half, so that it
     *    has as many rows as the top)
     * 5. Iterate over each row in the top half, and "merge" in points from the bottom half - if
     *    the top or bottom has a point turned "on" at any given x,y coordinate, it stays on, 
     *    otherwise it stays off.
     * 
     * I'm sure there is a more mathematical or analytical way to do this, possibly even without
     * having to map the entire matrix, but it makes my head hurt trying to think of that...
     */
     _foldUp(line) {
        const aboveLine = this.matrix.slice(0, line + 1);
        let belowLine = this.matrix.slice(line).reverse();

        if (aboveLine.length < belowLine.length) {
            let rowsToDrop = belowLine.length - aboveLine.length;
            belowLine = belowLine.slice(rowsToDrop);
        } else if (aboveLine.length > belowLine.length) {
            let rowsToAdd = aboveLine.length - belowLine.length;
            while (rowsToAdd > 0) {
                belowLine.unshift(new Array(this.matrix[0].length).fill(false));
                rowsToAdd--;
            }
        }

        this.matrix = aboveLine.map((row, y) => row.map((col, x) => col || belowLine[y][x]));
    }

    /**
     * This works exactly like _foldUp(line), only it works with a "left" and "right" chunk of the 
     * matrix, instead of a "top" and "bottom" chunk.
     */
    _foldLeft(line) {
        const leftOfLine = this.matrix.map(row => row.slice(0, line + 1));
        let rightOfLine = this.matrix.map(row => row.slice(line).reverse());

        if (leftOfLine[0].length < rightOfLine[0].length) {
            let colsToDrop = rightOfLine[0].length - leftOfLine[0].length;
            rightOfLine = rightOfLine.map(row => row.slice(colsToDrop));
        } else if (leftOfLine[0].length > rightOfLine[0].length) {
            let colsToAdd = leftOfLine[0].length - rightOfLine[0].length;
            rightOfLine = rightOfLine.map(row => row.unshift(new Array(colsToAdd).fill(false)));
        }

        this.matrix = leftOfLine.map((row, y) => row.map((col, x) => col || rightOfLine[y][x]));
    }

    toString() {
        return this.matrix.map(row => row.map(col => col ? '#' : ' ').join('')).join(os.EOL);
    }
}

class FoldInstruction {
    constructor(line) {
        const [orientation, num] = line.replace('fold along ', '').split('=');
        this.orientation = orientation == 'x' ? 'vertical' : 'horizontal';
        this.axis = parseInt(num);
    }
}

module.exports = { Paper };