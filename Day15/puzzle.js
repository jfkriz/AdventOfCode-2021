class CaveMap {
    constructor(data, expandTimes) {
        const matrix = data.map((line, y) => line.split('').map((risk, x) => new Point(x, y, parseInt(risk))));
        this.locations = (expandTimes === undefined) ? matrix : this._expandMap(matrix, expandTimes);

        const totalLines = this.locations.length;
        const lineLength = this.locations[0].length;

        this.locations.forEach((line, y) => line.forEach((loc, x) => {
            const up = y == 0 ? undefined : this.locations[y - 1][x];
            const down = y == (totalLines - 1) ? undefined : this.locations[y + 1][x];
            const left = x == 0 ? undefined : this.locations[y][x - 1];
            const right = x == (lineLength - 1) ? undefined : this.locations[y][x + 1];
            loc.setAdjacent(up, down, left, right);
        }));
    }

    _expandMap(matrix, times) {
        const height = matrix.length;
        const width = matrix[0].length;

        const newMatrix = new Array(height * times).fill().map(() => new Array(width * times).fill());

        matrix.forEach((row, y) => row.forEach((col, x) => {
            newMatrix[y][x] = col;
            for (let i = 1; i < times; i++) {
                let newX = (i * width) + x;
                let prevXPoint = newMatrix[y][((i - 1) * width) + x];
                newMatrix[y][newX] = new Point(newX, y, prevXPoint.risk == 9 ? 1 : prevXPoint.risk + 1);
            }
        }));

        for (let x = 0; x < newMatrix[0].length; x++) {
            for (let y = 0; y < height; y++) {
                for (let i = 1; i < times; i++) {
                    let newY = (i * height) + y;
                    let prevYPoint = newMatrix[((i - 1) * height) + y][x];
                    newMatrix[newY][x] = new Point(x, newY, prevYPoint.risk == 9 ? 1 : prevYPoint.risk + 1);
                }
            }
        }

        return newMatrix;
    }

    /**
     * This is essentially Dijkstra's Algorithm for finding the shortest path.
     * https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
     */
    findLeastRiskyPath() {
        const visited = new Set();
        const height = this.locations.length;
        const width = this.locations[0].length;
        const shortestDistance = new Array(height).fill().map(() => new Array(width).fill(-1));
        shortestDistance[0][0] = 0;

        const start = this.locations[0][0];
        const queue = new PriorityQueue((a, b) => b[1] > a[1]);
        queue.push([start, 0]);

        while (!queue.isEmpty()) {
            let [next, _] = queue.pop();
            visited.add(next);
            for (const adjacent of next.getAdjacentPoints().filter(p => !visited.has(p))) {
                let distance = shortestDistance[next.y][next.x] + this.locations[adjacent.y][adjacent.x].risk;
                if (distance < shortestDistance[adjacent.y][adjacent.x] || shortestDistance[adjacent.y][adjacent.x] == -1) {
                    shortestDistance[adjacent.y][adjacent.x] = distance;
                    queue.push([adjacent, distance])
                }
            }
        }

        return shortestDistance[height - 1][width - 1];
    }
}

class Point {
    constructor(x, y, risk) {
        this.x = x;
        this.y = y;
        this.risk = risk;

        this.up = undefined;
        this.down = undefined;
        this.left = undefined;
        this.right = undefined;
    }

    setAdjacent(up, down, left, right) {
        this.up = up;
        this.down = down;
        this.left = left;
        this.right = right;
    }

    getAdjacentPoints() {
        return [this.up, this.left, this.down, this.right].filter(p => p !== undefined);
    }

    toString() {
        return `coordinates: ${this.x.toString().padStart(2)},${this.y.toString().padStart(2)}, risk: ${this.risk}`;
    }
}

/**
 * Code borrowed (copied...) from this stack overflow post:
 * https://stackoverflow.com/a/42919752
 * 
 * I could have used one of any number of npm packages for this,
 * but I was hoping to not use any external libs. But in order to 
 * easily implement Dijkstra's algorithm for finding the shortest
 * path, this (or something like it) was a necessity.
 */
class PriorityQueue {
    constructor(comparator = (a, b) => a > b) {
        this._heap = [];
        this._comparator = comparator;

        this.top = 0;
    }

    parent = i => ((i + 1) >>> 1) - 1;
    left = i => (i << 1) + 1;
    right = i => (i + 1) << 1;

    size() {
        return this._heap.length;
    }
    isEmpty() {
        return this.size() == 0;
    }
    peek() {
        return this._heap[this.top];
    }
    push(...values) {
        values.forEach(value => {
            this._heap.push(value);
            this._siftUp();
        });
        return this.size();
    }
    pop() {
        const poppedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > this.top) {
            this._swap(this.top, bottom);
        }
        this._heap.pop();
        this._siftDown();
        return poppedValue;
    }
    replace(value) {
        const replacedValue = this.peek();
        this._heap[this.top] = value;
        this._siftDown();
        return replacedValue;
    }
    _greater(i, j) {
        return this._comparator(this._heap[i], this._heap[j]);
    }
    _swap(i, j) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }
    _siftUp() {
        let node = this.size() - 1;
        while (node > this.top && this._greater(node, this.parent(node))) {
            this._swap(node, this.parent(node));
            node = this.parent(node);
        }
    }
    _siftDown() {
        let node = this.top;
        while (
            (this.left(node) < this.size() && this._greater(this.left(node), node)) ||
            (this.right(node) < this.size() && this._greater(this.right(node), node))
        ) {
            let maxChild = (this.right(node) < this.size() && this._greater(this.right(node), this.left(node))) ? this.right(node) : this.left(node);
            this._swap(node, maxChild);
            node = maxChild;
        }
    }
}

module.exports = { CaveMap };
