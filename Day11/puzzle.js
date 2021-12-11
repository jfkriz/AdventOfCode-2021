class Simulation {
    constructor(data) {
        this._map = data.map((line, y) => line.split('').map((o, x) => new Octopus(x, y, parseInt(o))));

        const totalLines = this._map.length;
        const lineLength = this._map[0].length;
        this._map.forEach((line, y) => line.forEach((octopus, x) => {
            const up = y == 0 ? undefined : this._map[y-1][x];
            const down = y == (totalLines - 1) ? undefined : this._map[y+1][x];
            const left = x == 0 ? undefined : this._map[y][x-1];
            const right = x == (lineLength - 1) ? undefined : this._map[y][x+1];
            const upLeft = y == 0 || x == 0 ? undefined : this._map[y-1][x-1];
            const upRight = y == 0 || x == (lineLength - 1) ? undefined : this._map[y-1][x+1];
            const downLeft = y == (totalLines - 1) || x == 0 ? undefined : this._map[y+1][x-1];
            const downRight = y == (totalLines - 1) || x == (lineLength - 1) ? undefined : this._map[y+1][x+1];
            octopus.setAdjacent(up, down, left, right, upLeft, upRight, downLeft, downRight);
        }));
    }

    runSimulation(days) {
        let flashes = 0;
        for (let day = 0; day < days; day++) {
            flashes += this._simulateDay();
            console.log(`Flashes after ${day + 1} days: ${flashes}`);
        }

        return flashes;
    }

    _simulateDay() {
        let flashes = 0;
        this._map.flat().forEach(o => flashes += o.increaseEnergy());
        this._map.flat().forEach(o => o.reset());

        return flashes;
    }

    findFirstSimultaneuosFlash() {
        let day = 0;
        let flashes = 0;
        const count = this._map.flat().length;
        while(flashes != count) {
            day++;
            flashes = this._simulateDay();
            console.log(`Flashes on day ${day}: ${flashes}`);
        }

        return day;
    }
}

class Octopus {
    constructor(x, y, energy) {
        this.x = x;
        this.y = y;
        this.energy = energy;
        this.flashed = false;

        this.up = undefined;
        this.down = undefined;
        this.left = undefined;
        this.right = undefined;
        this.upLeft = undefined;
        this.upRight = undefined;
        this.downLeft = undefined;
        this.downRight = undefined;
    }

    setAdjacent(up, down, left, right, upLeft, upRight, downLeft, downRight) {
        this.up = up;
        this.down = down;
        this.left = left;
        this.right = right;
        this.upLeft = upLeft;
        this.upRight = upRight;
        this.downLeft = downLeft;
        this.downRight = downRight;
    }

    increaseEnergy() {
        this.energy++;
        let flashes = 0;
        if (this.energy > 9 && !this.flashed) {
            flashes = 1;
            this.flashed = true;

            this.getAdjacentOctopi().forEach(o => {
                flashes += o.increaseEnergy();
            });
        }

        return flashes;
    }

    reset() {
        if (this.flashed) {
            this.energy = 0;
            this.flashed = 0;
        }
    }

    getAdjacentOctopi() {
        return [ 
            this.left, 
            this.upLeft, 
            this.up, 
            this.upRight, 
            this.right,
            this.downRight, 
            this.down,
            this.downLeft
        ].filter(o => o !== undefined);
    }

    toString() {
        return `coordinates: ${this.x.toString().padStart(2)},${this.y.toString().padStart(2)}, energy: ${this.energy}`;
    }
}

module.exports = { Simulation }