const os = require('os');

class Reactor {
    #instructions;
    constructor(data) {
        this.#instructions = data.map(line => new Instruction(line));
    }

    initialize(xRange, yRange, zRange) {
        const cubes = new Cubes();
        this.#instructions.forEach((instruction, i) => {
            console.log(
                `Executing instruction ${i + 1} of ${this.#instructions.length}`
            );
            instruction.execute(cubes, xRange, yRange, zRange);
        });

        return cubes;
    }

    reboot(xRange, yRange, zRange) {
        let cuboids = [];
        let sum = 0;
        this.#instructions.forEach((i, j) => {
            cuboids = i.executeOptimized(cuboids, xRange, yRange, zRange);
            console.log(
                `After step ${j + 1}, ${cuboids
                    .map(c => c.totalCubes)
                    .sum()} cubes are on`
            );
        });

        return cuboids.map(c => c.totalCubes).sum();
    }
}

class Instruction {
    #on;
    #cuboid;
    constructor(line) {
        this.#on = line.split(' ')[0] == 'on';
        this.#cuboid = new Cuboid(
            ...line
                .split(' ')[1]
                .split(',')
                .map(range =>
                    range.split('..').map(n => parseInt(n.replace(/^.*=/, '')))
                )
        );
        this.#cuboid.on = this.#on;
    }

    execute(cubes, xRange, yRange, zRange) {
        if (cubes === undefined) {
            cubes = new Cubes();
        }

        return this.#cuboid.generate(cubes, this.#on, xRange, yRange, zRange);
    }

    executeOptimized(cuboids) {
        let newCuboids = [];
        if (this.#on) {
            let work = [this.#cuboid];

            let cuboidsToProcess = [...cuboids];
            let cuboidToProcess = 0;

            while (
                work.length > 0 ||
                cuboidToProcess < cuboidsToProcess.length
            ) {
                if (work.length == 0) {
                    newCuboids.push(...cuboidsToProcess.slice(cuboidToProcess));
                    cuboidsToProcess.length = 0;
                } else if (cuboidToProcess >= cuboidsToProcess.length) {
                    newCuboids.push(...work);
                    work.length = 0;
                } else {
                    let rebootCuboids = [...work];
                    work.length = 0;
                    let currentCuboid = cuboidsToProcess[cuboidToProcess++];
                    rebootCuboids.forEach(rebootCuboid => {
                        if (currentCuboid.intersects(rebootCuboid)) {
                            let remaining =
                                currentCuboid.split(rebootCuboid)[2];
                            work.push(...remaining);
                        } else {
                            work.push(rebootCuboid);
                        }
                    });
                    newCuboids.push(currentCuboid);
                }
            }
        } else {
            cuboids.forEach(c => {
                if (c.intersects(this.#cuboid)) {
                    let split = c.split(this.#cuboid);
                    newCuboids.push(...split[0]);
                } else {
                    newCuboids.push(c);
                }
            });
        }

        let dupes = new Set();
        return newCuboids.filter(c => {
            if (dupes.has(c.key)) {
                return false;
            } else {
                dupes.add(c.key);
                return true;
            }
        });
    }
}

class Cuboid {
    #x;
    #y;
    #z;
    #on;
    constructor(xRange, yRange, zRange) {
        this.#x = Array.isArray(xRange) ? new Range(...xRange) : xRange;
        this.#y = Array.isArray(yRange) ? new Range(...yRange) : yRange;
        this.#z = Array.isArray(zRange) ? new Range(...zRange) : zRange;
    }

    generate(cubes, on = true, xRange, yRange, zRange) {
        if (cubes === undefined) {
            cubes = new Cubes();
        }

        let xr, yr, zr;
        if (
            xRange !== undefined &&
            yRange !== undefined &&
            zRange !== undefined
        ) {
            if (
                this.#x.upper < xRange.lower ||
                this.#x.lower > xRange.upper ||
                this.#y.upper < yRange.lower ||
                this.#y.lower > yRange.upper ||
                this.#z.upper < zRange.lower ||
                this.#z.lower > zRange.upper
            ) {
                return cubes;
            }

            xr = new Range(
                Math.max(xRange.lower, this.#x.lower),
                Math.min(xRange.upper, this.#x.upper)
            );
            yr = new Range(
                Math.max(yRange.lower, this.#y.lower),
                Math.min(yRange.upper, this.#y.upper)
            );
            zr = new Range(
                Math.max(zRange.lower, this.#z.lower),
                Math.min(zRange.upper, this.#z.upper)
            );
        } else {
            [xr, yr, zr] = [this.#x, this.#y, this.#z];
        }

        for (let x = xr.lower; x <= xr.upper; x++) {
            for (let y = yr.lower; y <= yr.upper; y++) {
                for (let z = zr.lower; z <= zr.upper; z++) {
                    if (on) {
                        cubes.add(x, y, z);
                    } else {
                        cubes.delete(x, y, z);
                    }
                }
            }
        }

        return cubes;
    }

    get totalCubes() {
        return this.#x.count * this.#y.count * this.#z.count;
    }

    split(that) {
        let intersection = new Cuboid(
            new Range(
                Math.max(this.x.lower, that.x.lower),
                Math.min(this.x.upper, that.x.upper)
            ),
            new Range(
                Math.max(this.y.lower, that.y.lower),
                Math.min(this.y.upper, that.y.upper)
            ),
            new Range(
                Math.max(this.z.lower, that.z.lower),
                Math.min(this.z.upper, that.z.upper)
            )
        );

        let thisDistinct = this.remove(intersection);
        let thatDistinct = that.remove(intersection);

        return [thisDistinct, [intersection], thatDistinct];
    }

    /**
     * This was the toughest part of today's problem, part 2. I thought I had everything working as expected,
     * but I was not getting the right answer, even for the example inputs. After once again modeling this with
     * some origami cubes, I saw what I was missing - when you remove the intersection, you have to retain
     * all of the cuboids that surround the intersection. This means up to 6 cuboids should be retained
     * after the intersection is removed, keeping in mind that you have to view this in a 3D space:
     * 1. The cuboid in front of the intersection
     * 2. The cuboid behind the intersection
     * 3. The cuboid to the left of the intersection
     * 4. The cuboid to the right of the intersection
     * 5. The cuboid above the intersection
     * 6. The cuboid below the intersection
     * @param {Cuboid} intersection the intersection cuboid to remove from this one
     * @returns the current cuboid, with the cuboid from `intersection` removed
     */
    remove(intersection) {
        let retain = [];

        // Front
        if (this.z.lower < intersection.z.lower) {
            retain.push(
                new Cuboid(
                    this.x,
                    intersection.y,
                    new Range(this.z.lower, intersection.z.lower - 1)
                )
            );
        }

        // Back
        if (this.z.upper > intersection.z.upper) {
            retain.push(
                new Cuboid(
                    this.x,
                    intersection.y,
                    new Range(intersection.z.upper + 1, this.z.upper)
                )
            );
        }

        // Left
        if (this.x.lower < intersection.x.lower) {
            retain.push(
                new Cuboid(
                    new Range(this.x.lower, intersection.x.lower - 1),
                    intersection.y,
                    intersection.z
                )
            );
        }

        // Right
        if (this.x.upper > intersection.x.upper) {
            retain.push(
                new Cuboid(
                    new Range(intersection.x.upper + 1, this.x.upper),
                    intersection.y,
                    intersection.z
                )
            );
        }

        // Up
        if (this.y.upper > intersection.y.upper) {
            retain.push(
                new Cuboid(
                    this.x,
                    new Range(intersection.y.upper + 1, this.y.upper),
                    this.z
                )
            );
        }

        // Down
        if (this.y.lower < intersection.y.lower) {
            retain.push(
                new Cuboid(
                    this.x,
                    new Range(this.y.lower, intersection.y.lower - 1),
                    this.z
                )
            );
        }

        return retain;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get z() {
        return this.#z;
    }

    get key() {
        return `${this.x},${this.y},${this.z}`;
    }

    intersects(that) {
        return (
            this.x.intersects(that.x) &&
            this.y.intersects(that.y) &&
            this.z.intersects(that.z)
        );
    }

    get on() {
        return this.#on;
    }

    set on(val) {
        this.#on = val;
    }

    toString() {
        return `X: ${this.x}, Y: ${this.y}, Z: ${this.z} -- on ? ${this.on} -- cubes: ${this.totalCubes}`;
    }
}

class Range {
    #lower;
    #upper;
    constructor(start, end) {
        this.#lower = Math.min(start, end);
        this.#upper = Math.max(start, end);
    }

    get lower() {
        return this.#lower;
    }

    get upper() {
        return this.#upper;
    }

    get count() {
        return this.#upper - this.#lower + 1;
    }

    intersects(that) {
        return this.upper >= that.lower && this.lower <= that.upper;
    }

    toString() {
        return `${this.lower}..${this.upper}`;
    }
}

class Cubes {
    #all;
    #total;
    constructor() {
        this.#all = {};
        this.#total = 0;
    }

    add(x, y, z) {
        if (this.#all[x] === undefined) {
            this.#all[x] = {};
        }

        if (this.#all[x][y] === undefined) {
            this.#all[x][y] = {};
        }

        if (this.#all[x][y][z] === undefined) {
            this.#total++;
        }

        this.#all[x][y][z] = true;
    }

    delete(x, y, z) {
        if (this.#all[x] === undefined) {
            return;
        }

        if (this.#all[x][y] === undefined) {
            return;
        }

        if (this.#all[x][y][z] === undefined) {
            return;
        }

        delete this.#all[x][y][z];
        this.#total--;
    }

    get total() {
        return this.#total;
    }
}

module.exports = { Reactor, Range };
