const os = require('os');

class LanternFish {
    constructor(timer) {
        if (timer) {
            this.timer = parseInt(timer);
        } else {
            this.timer = 8;
        }
    }

    spawnNew() {
        if (--this.timer < 0) {
            this.timer = 6;
            return true;
        } else {
            return false;
        }
    }

    toString() {
        return this.timer.toString();
    }
}

class Simulation {
    constructor(days, data) {
        this.days = days;
        this.fish = data[0].split(',').map(n => new LanternFish(n));
    }

    run() {
        // console.log(`Initial state: ${this.toString()}`);
        for (let day = 0; day < this.days; day++) {
            const start = new Date();
            this.fish.forEach(f => {
                if (f.spawnNew()) {
                    this.fish.push(new LanternFish());
                }
            });
            const end = new Date();
            // Added this when I saw that it was taking a LONG time for puzzle #2 to run. By the time it
            // got to ~day 180 for just the test input, it was taking about 25 seconds per day, and increasing... 
            console.log(`Day ${day.toString().padStart(3, ' ')} complete; ${(end.getTime() - start.getTime()) / 1000} seconds`);
            // console.log(`After ${(day + 1).toString().padStart(2, ' ')} day${day > 0 ? 's:' : ': '} ${this.toString()}`)
        }

        return this.fish.length;
    }

    toString() {
        return `${this.fish.map(f => f.toString()).join(',')}`;
    }
}

/**
 * Puzzle #2 - had to optimize, because the exponential growth would have taken hours (I think) 
 * to complete, with the previous algorithm.
 * 
 * This one is actually a much simpler implementation, but you would not be able to easily read
 * the code and understand what is going on like the previous one... This simply keeps track of the
 * total number of fish on each day in the 9-day cycle, and as each day passes, it shifts the entire
 * cycle down one day, moves the fish on day 0 onto day 8 (those are the newly spawned fish), and 
 * also adds that same number to day 6 (those are the existing fish starting their cycle again).
 */
class SimulationOptimized {
    constructor(simulationDays, data) {
        this.days = simulationDays;

        this.cycleDays = data[0].split(',').map(n => parseInt(n)).reduce((cycle, day) => {
            cycle[day] += 1;
            return cycle;
        }, new Array(9).fill(0));
    }

    run() {
        for (let day = 0; day < this.days; day++) {
            // Array.shift shifts the entire array left, popping the first item off the array and returning it.
            // By using push(shift()), this is a one-liner for moving the first element in an array to the end
            // of the array.
            this.cycleDays.push(this.cycleDays.shift());
            // Now just add the number of fish that just spawned to the total on the 7th day.
            this.cycleDays[6] += this.cycleDays[8];
        }

        return this.cycleDays.reduce((a, b) => a + b, 0);
    }
}

module.exports = { LanternFish, Simulation, SimulationOptimized }