class DiceGame {
    #players;
    #currentPlayer;
    #totalRolls;
    #die;
    #playerPositions;
    constructor(data, dieSides) {
        this.#players = data
            .map(line =>
                line
                    .replace(/[^\d:]/g, '')
                    .split(':')
                    .map(p => parseInt(p))
            )
            .map(p => new Player(...p));
        this.#currentPlayer = new WraparoundNumber(2, 1);
        this.#totalRolls = 0;
        this.#die = new DeterministicDie(dieSides);
        this.#playerPositions = this.#players.map(
            p => new WraparoundNumber(10, p.startingPosition)
        );
    }

    playDeterministic() {
        do {
            let roll = this.#die.roll(3);
            let spaces = roll.sum();
            this.#totalRolls += 3;
            let space =
                this.#playerPositions[this.#currentPlayer.value - 1].plus(
                    spaces
                );
            this.#players[this.#currentPlayer.value - 1].addScore(space);
            console.log(
                `Player ${this.#currentPlayer.value} rolls ${roll
                    .map(n => n.toString())
                    .join('+')} and moves to space ${
                    this.#playerPositions[this.#currentPlayer.value - 1].value
                } for a total score of ${
                    this.#players[this.#currentPlayer.value - 1].score
                }`
            );
            this.#currentPlayer.plus(1);
        } while (!this.#gameOver());

        const losingScore = this.#players.find(p => p.score < 1000).score;
        console.log(
            `Total Rolls: ${this.#totalRolls}, Losing Score: ${losingScore}`
        );
        return this.#totalRolls * losingScore;
    }

    #gameOver() {
        return this.#players.findIndex(p => p.score >= 1000) >= 0;
    }

    get winningPlayer() {
        return this.#players.find(p => p.score >= 1000);
    }
}

class DeterministicDie {
    #currentNumber;
    constructor(sides) {
        this.#currentNumber = new WraparoundNumber(sides, 1);
    }

    roll(times) {
        let rolls = [];
        while (times-- > 0) {
            rolls.push(this.#currentNumber.value);
            this.#currentNumber.plus(1);
        }
        return rolls;
    }
}

class Player {
    #id;
    #startingPosition;
    #currentPosition;
    #score;
    #totalWins;
    constructor(id, startingPosition) {
        this.#id = id;
        this.#startingPosition = startingPosition;
        this.#currentPosition = new WraparoundNumber(10, startingPosition);
        this.#score = 0;
        this.#totalWins = 0;
    }

    get score() {
        return this.#score;
    }

    set score(val) {
        this.#score = val;
    }

    addScore(n) {
        this.#score += n;
        return this.#score;
    }

    get startingPosition() {
        return this.#startingPosition;
    }

    get currentPosition() {
        return this.#currentPosition;
    }

    get totalWins() {
        return this.#totalWins;
    }

    set totalWins(val) {
        this.#totalWins = val;
    }
}

class WraparoundNumber {
    #max;
    #current;
    constructor(max, current) {
        this.#max = max;
        this.#current = current === undefined ? 1 : Math.max(1, current);
    }

    plus(n) {
        if (n > this.#max) {
            n = n % this.#max;
        }
        if (n <= this.#max - this.#current) {
            this.#current += n;
        } else {
            this.#current = n - (this.#max - this.#current);
        }

        return this.#current;
    }

    get value() {
        return this.#current;
    }

    set value(val) {
        this.#current = val;
    }

    toString() {
        return `current: ${this.#current}, max: ${this.#max}`;
    }
}

class QuantumDiceGame {
    #players;
    #allPossibleRollOutcomes;
    #maxRollTotal;
    #minRollTotal;
    #sum1;
    #sum2;
    constructor(data, dieSides) {
        this.#players = data
            .map(line =>
                line
                    .replace(/[^\d:]/g, '')
                    .split(':')
                    .map(p => parseInt(p))
            )
            .map(p => new Player(...p));

        // Map all the possible outcomes of 3 rolls (key is the total of the 3 dice, value is the number of
        // ways you can get that total).
        //
        // This was taking a while in the recursive function, even though it is fast, it was being
        // executed a LOT!
        const outcomes = {};
        for (let r1 = 1; r1 <= dieSides; r1++) {
            for (let r2 = 1; r2 <= dieSides; r2++) {
                for (let r3 = 1; r3 <= dieSides; r3++) {
                    const outcome = r1 + r2 + r3;
                    outcomes[outcome] = (outcomes[outcome] || 0) + 1;
                }
            }
        }

        this.#allPossibleRollOutcomes = outcomes;

        this.#minRollTotal = Math.min(
            ...Object.keys(outcomes).map(o => parseInt(o))
        );

        this.#maxRollTotal = Math.max(
            ...Object.keys(outcomes).map(o => parseInt(o))
        );

        this.#sum1 = 0;
        this.#sum2 = 0;
    }

    play() {
        return this.#playQuantum(this.#players[0], this.#players[1], 1);
    }

    #playQuantum(p1, p2, p1Turn) {
        const currentPlayer = p1Turn ? p1 : p2;

        if (p1.score >= 21) {
            return 1;
        } else if (p2.score >= 21) {
            return 0;
        }

        let sum = 0;

        for (
            let outcome = this.#minRollTotal;
            outcome <= this.#maxRollTotal;
            outcome++
        ) {
            const oldPos = currentPlayer.currentPosition.value;
            const oldScore = currentPlayer.score;

            currentPlayer.currentPosition.plus(outcome);
            currentPlayer.addScore(
                currentPlayer.currentPosition.value,
                this.#allPossibleRollOutcomes[outcome]
            );

            sum +=
                this.#allPossibleRollOutcomes[outcome] *
                this.#playQuantum(p1, p2, !p1Turn);

            currentPlayer.currentPosition.value = oldPos;
            currentPlayer.score = oldScore;
        }

        return sum;
    }
}

module.exports = { DiceGame, QuantumDiceGame };
