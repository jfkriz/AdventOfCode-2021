const os = require('os');

class Game {
    constructor(gameData) {
        this.numbers = gameData[0].split(',').map(number => parseInt(number));
        this.boards = new Array(0);
        this.lastNumberCalled = null;
        this.lastWinningBoard = null;

        for (let i = 2; i < gameData.length; i += 6) {
            this.boards.push(new Board(gameData.slice(i, i + 5)));
        }
    }

    play() {
        for (let num of this.numbers) {
            this.lastNumberCalled = num;
            for (let board of this.boards) {
                board.markCalledNumber(num);
                if (board.isWinner()) {
                    return board;
                }
            }
        }

        return null;
    }

    playAll() {
        for (let num of this.numbers) {
            this.lastNumberCalled = num;
            for (let board of this.boards) {
                if (!board.isWinner()) {
                    board.markCalledNumber(num);
                    if (board.isWinner()) {
                        this.lastWinningBoard = board;
                    }
                }
            }
        }

        return this.lastWinningBoard;
    }

    toString() {
        return `Numbers: ${this.numbers}${os.EOL}${os.EOL}Boards:${os.EOL}${this.boards.map(board => board.toString()).join(os.EOL + os.EOL)}`;
    }
}

class Board {
    constructor(boardData) {
        this.rows = boardData.map(row => row.trim().split(/ +/).map(cell => parseInt(cell)));
        this.lastMarkedNumber = null;
    }

    markCalledNumber(num) {
        // To mark a called number, we'll add 100 to it
        this.rows.forEach((row, rowIndex) => row.forEach((cell, colIndex) => {
            if (cell == num) {
                this.rows[rowIndex][colIndex] = num + 100;
                this.lastMarkedNumber = num;
            }
        }));
    }

    isWinner() {
        // Check for horizontal bingo
        if (this.rows.some(row => row.every(cell => cell >= 100))) {
            return true;
        }

        // Transpose the array, and check again - this will find vertical bingo
        if (this.rows[0].map((_, i) => this.rows.map(x => x[i])).some(row => row.every(cell => cell >= 100))) {
            return true;
        }

        return false;
    }

    sumUnmarkedNumbers() {
        return this.rows.flat().filter(num => num < 100).reduce((a, b) => a + b, 0);
    }

    toString() {
        return this.rows.map(row => row.map(cell => {
            if (cell >= 100) {
                return ('*' + (cell - 100).toString()).padStart(3, ' ');
            } else {
                return cell.toString().padStart(3, ' ');
            }
        }).join(' ')).join(os.EOL);
    }
}

module.exports = { Game, Board }