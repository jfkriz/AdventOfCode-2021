class SmokeMap {
    constructor(data) {
        this.locations = data.map((line, y) => line.split('').map((height, x) => new Point(x, y, parseInt(height))));

        const totalLines = this.locations.length;
        const lineLength = this.locations[0].length;
        this.locations.forEach((line, y) => line.forEach((loc, x) => {
            const up = y == 0 ? undefined : this.locations[y-1][x];
            const down = y == (totalLines - 1) ? undefined : this.locations[y+1][x];
            const left = x == 0 ? undefined : this.locations[y][x-1];
            const right = x == (lineLength - 1) ? undefined : this.locations[y][x+1];
            loc.setAdjacent(up, down, left, right);
        }));
    }

    findLowPoints() {
        return this.locations.flat().filter(loc => loc.isLowerThanAdjacentPoints());
    }

    findBasins() {
        return this.findLowPoints().map(p => new Basin(p));
    }
}

class Point {
    constructor(x, y, height) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.isInBasin = false;

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
        return [ this.left, this.up, this.right, this.down ].filter(p => p !== undefined);
    }

    getLargerAdjacentPoints() {
        return this.getAdjacentPoints().filter(p => p.height > this.height);
    }

    isLowerThanAdjacentPoints() {
        return this.getAdjacentPoints().every(adjacent => this.height < adjacent.height);
    }

    toString() {
        return `coordinates: ${this.x.toString().padStart(2)},${this.y.toString().padStart(2)}, height: ${this.height}`;
    }
}

class Basin {
    constructor(lowPoint) {
        this.lowPoint = lowPoint;
        this.lowPoint.isInBasin = true;

        this.points = this._calculate([this.lowPoint], 0);
        this.size = this.points.length;
    }

    _calculate(currentBasin, start) {
        const next = [];
        currentBasin.slice(start).forEach(p => {
            const flow = p.getLargerAdjacentPoints().filter(n => !n.isInBasin && n.height < 9);
            if (flow.length > 0) {
                flow.forEach(n => { n.isInBasin = true });
                next.push(...flow);
            }
        });

        if (next.length == 0) {
            return currentBasin;
        } else {
            return this._calculate(currentBasin.concat(next), currentBasin.length - 1);
        }
    }

    toString() {
        return `lowPoint: { ${this.lowPoint} }, size: ${this.size.toString().padStart(3)}`;
    }
}

module.exports = { SmokeMap };