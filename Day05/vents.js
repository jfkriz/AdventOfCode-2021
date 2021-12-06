class Vent {
    constructor(line) {
        let points = line.split(' -> ').map(coord => new Point(coord));
        this.begin = points[0];
        this.end = points[1];
    }

    isDiagonal() {
        return !(this.isHorizontal() || this.isVertical());
    }

    isHorizontal() {
        return this.begin.y == this.end.y;
    }

    isVertical() {
        return this.begin.x == this.end.x;
    }

    getPoints() {
        if (this.isHorizontal()) {
            let begin = Math.min(this.begin.x, this.end.x);
            let end = Math.max(this.begin.x, this.end.x);
            let length = end - begin + 1;
            return Array.from({length: length}, (_, i) => i + begin).map(x => new Point(x, this.begin.y));
        } else if (this.isVertical()) {
            let begin = Math.min(this.begin.y, this.end.y);
            let end = Math.max(this.begin.y, this.end.y);
            let length = end - begin + 1;
            return Array.from({length: length}, (_, i) => i + begin).map(y => new Point(this.begin.x, y));
        } else {
            const iterations = Math.abs(this.end.x - this.begin.x);
            const incX = this.begin.x <= this.end.x ? 1 : -1;
            const incY = this.begin.y <= this.end.y ? 1 : -1;
            
            let points = [];
            for (let i = 0, y = this.begin.y; i <= iterations; i++, y += incY) {
                let x = (i * incX) + this.begin.x;
                points.push(new Point(x, y));
            }
            return points;
        }
    }

    toString() {
        return `${this.begin.toString()} -> ${this.end.toString()}`;
    }
}

class Point {
    constructor(x, y) {
        if (y == undefined) {
            [ this.x, this.y ] = x.split(',').map(n => parseInt(n));
        } else {
            [ this.x, this.y ] = [ x, y ];
        }
    }

    toString() {
        return `${this.x},${this.y}`;
    }
}

module.exports = { Vent, Point }