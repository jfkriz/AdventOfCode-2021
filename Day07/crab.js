class Simulation {
    constructor(data, constantBurnRate) {
        this.positions = data.split(',').map(p => parseInt(p));
        this.constantBurnRate = constantBurnRate === undefined ? true : constantBurnRate;
    }

    run() {
        let leastFuel = undefined;
        let leastFuelPosition = undefined;

        let start = Math.min(...this.positions);
        let end = Math.max(...this.positions);

        for(let target = start; target <= end; target++) {
            let fuelUsed = 0;
            this.positions.forEach(begin => {
                const distance = Math.abs(target - begin);
                fuelUsed += this.constantBurnRate ? distance : this.sumSequence(distance);
            });

            // console.log(`Fuel at position ${target}: ${fuelUsed}`);

            if (leastFuel === undefined || fuelUsed < leastFuel) {
                leastFuel = fuelUsed;
                leastFuelPosition = target;
            }
        }

        return new SimulationAnswer(leastFuel, leastFuelPosition);
    }

    sumSequence(distance) {
        if (distance == 0) {
            return 0;
        }

        return (distance * (distance + 1)) / 2;
    }
}

class SimulationAnswer {
    constructor(fuel, position) {
        this.fuel = fuel;
        this.position = position;
    }
}

module.exports = { Simulation, SimulationAnswer }