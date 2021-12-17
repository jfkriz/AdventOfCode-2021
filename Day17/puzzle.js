class ProbeLauncher {
    #target
    constructor(data) {
        const [xRange, yRange] = data.match(/(-?\d+\.\.-?\d+)/g).map(r => r.split('..').map(n => parseInt(n)));
        const upperLeft = new Point(Math.min(...xRange), Math.max(...yRange));
        const lowerRight = new Point(Math.max(...xRange), Math.min(...yRange));

        this.#target = new Target(upperLeft, lowerRight);
    }

    launch(xVelocity, yVelocity) {
        let points = [new Point(0, 0)];
        let hit = this.#calculateOutcome(xVelocity, yVelocity, points);

        return new LaunchOutcome(xVelocity, yVelocity, points, hit);
    }

    #calculateOutcome(xVelocity, yVelocity, points) {
        let current = points.at(-1);
        while (!this.#target.hit(current) && !this.#target.miss(current)) {
            let next = new Point(current.x + xVelocity, current.y + yVelocity);
            // console.log(`Trying point ${next}`);
            points.push(next);
            current = next;

            xVelocity = xVelocity > 0 ? xVelocity - 1 : xVelocity < 0 ? xVelocity + 1 : 0;
            yVelocity = yVelocity - 1;
        }

        return this.#target.hit(current);
    }

    /**
     * Loop over all the X positions til we pass the right side of the target range, using those 
     * as starting velocities. You can't hit the target if your initial starting horizontal velo
     * is going to put you past the range on the first step. At least that's my theory...
     * 
     * Then for each X velo we try, also loop over all the possible Y values til we pass the bottom
     * of the target range, or until we miss the range.
     * @returns an the successful Launch Outcome with the highest Y coordinate  
     */
    trickShotHighestApex() {
        let highest = undefined;
        for (let x = 0; x <= this.#target.lowerRight.x; x++) {
            for (let y = 0; y <= Math.abs(this.#target.lowerRight.y); y++) {
                const result = this.launch(x, y);
                if (result.hit && (highest == undefined || result.apex.y > highest.apex.y)) {
                    highest = result;
                }
            }
        }

        return highest;
    }

    /**
     * Loop over all the X positions til we pass the right side of the target range, using those 
     * as starting velocities. You can't hit the target if your initial starting horizontal velo
     * is going to put you past the range on the first step. At least that's my theory...
     * 
     * Then for each X velo we try, also loop over all the possible Y values til we pass the bottom
     * of the target range, or until we miss the range. During the same iteration, try a negative
     * Y velo with the X to see if that works as well.
     * @returns an array of all possible successful Launch Outcomes 
     */
    allPossibleHits() {
        let results = [];
        for (let x = 0; x <= this.#target.lowerRight.x; x++) {
            for (let y = 0; y <= Math.abs(this.#target.lowerRight.y); y++) {
                // First try X velocity with an upward Y velocity
                let result = this.launch(x, y);
                if (result.hit) {
                    results.push(result);
                }

                // Now try the same X velocity with a downward Y velocity
                result = this.launch(x, y*-1);
                if (result.hit) {
                    results.push(result);
                }
            }
        }

        return this.#uniqueLaunchResults(results);
    }

    #uniqueLaunchResults(results) {
        const unique = new Set();
        return results.filter(r => {
            const key = `${r.xVelocity},${r.yVelocity}`;
            if (unique.has(key)) {
                return false;
            }
            unique.add(key);
            return true;
        });
    }

    toString() {
        return this.#target.toString();
    }
}

class LaunchOutcome {
    #xVelocity
    #yVelocity
    #points
    #hit
    constructor(xVelocity, yVelocity, points, hit) {
        this.#xVelocity = xVelocity;
        this.#yVelocity = yVelocity;
        this.#points = points;
        this.#hit = hit;
    }

    get xVelocity() { return this.#xVelocity; }

    get yVelocity() { return this.#yVelocity; }

    get hit() { return this.#hit; }

    get points() { return this.#points; }

    get apex() {
        return this.#points.map(p => p).sort((a, b) => b.y - a.y)[0];
    }

    toString() {
        return `Velocity: ${this.#xVelocity},${this.#yVelocity}, Apex: ${this.apex}, Hit: ${this.hit}`;
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `${this.x},${this.y}`;
    }
}

class Target {
    #upperLeft
    #lowerRight
    constructor(upperLeft, lowerRight) {
        this.#upperLeft = upperLeft;
        this.#lowerRight = lowerRight;
    }

    miss(point) {
        if(this.hit(point)) {
            return false;
        }

        //return point.y < this.#lowerRight.y && (point.x < this.#upperLeft.x || point.x > this.#lowerRight.x);
        return point.x > this.#lowerRight.x || point.y < this.#lowerRight.y;
    }

    hit(point) {
        return point.x >= this.#upperLeft.x && point.x <= this.#lowerRight.x
            && point.y <= this.#upperLeft.y && point.y >= this.#lowerRight.y;
    }

    get upperLeft() { return this.#upperLeft; }

    get lowerRight() { return this.#lowerRight; }

    toString() {
        return `${this.#upperLeft} -> ${this.#lowerRight}`;
    }
}

module.exports = { ProbeLauncher };