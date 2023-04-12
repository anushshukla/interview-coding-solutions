interface PositionUpDown {
	[key: number]: number;
}

interface Positions {
	source: number;
	destination: number;
}

class Board {
	private _size = 100;
	private _rowCount = 10;
	private _maxSnakeSize = 5;
	private _maxLaddersSize = 5;
	private _positions: PositionUpDown = {};
	public constructor(
		snakePositions: Positions[],
		ladderPositions: Positions[]
	) {
		if (snakePositions.length > this._maxSnakeSize) {
			throw new Error("Snakes must less than equal to " + this._maxSnakeSize);
		}

		if (ladderPositions.length > this._maxLaddersSize) {
			throw new Error("Ladder must less than equal to " + this._maxSnakeSize);
		}

		let positions = [...ladderPositions, ...snakePositions];

		const positionsHashmap: PositionUpDown = {};

		let index = 0;
		for (const position of positions) {
			const destinationPos = position.destination;
			const sourcePos = position.source;
			if (destinationPos < 1 || destinationPos > this._size) {
				throw new Error(
					"Destination position should be between 1 to " + this._size
				);
			}

			if (sourcePos < 1 || sourcePos > this._size) {
				throw new Error("Source position should be between 1 to " + this._size);
			}

			if (Math.abs(sourcePos - destinationPos) < this._rowCount) {
				throw new Error(
					"Destination and source position should be in different rows"
				);
			}

            if (positionsHashmap[sourcePos]) {
                throw new Error("Snake and ladder should be on different positions");
            }

			if (index < ladderPositions.length && sourcePos > destinationPos) {
				throw new Error("Destination position should be greater than source position for ladders");
			}

			if (index >= ladderPositions.length && sourcePos < destinationPos) {
				throw new Error("Destination position should be greater than source position for snakes");
			}

			positionsHashmap[sourcePos] = destinationPos;
			index++;
		}
		// validation for diagonal tail values for ladder
		this._positions = positionsHashmap;
	}

    public get positions(): PositionUpDown {
        return this._positions;
    } 
}

class Player {
	private _name: string;
	private _position = 1;
	private _size = 6;
	private _start = 1;
	public constructor(name: string) {
		this._name = name;
	}
	public rollDice(board: Board): number {
		const number = Math.floor(Math.random() * (this._size - this._start + 1) + this._start);
		let newPos = this._position + number;
		if (newPos > 100) {
			return number;
		}
		this._position = board.positions[newPos] || newPos;
		return number;
	}
	public get position(): number {
		return this._position;
	}
	public get name(): string {
		return this._name;
	}
}

interface Players {
	[key: number]: Player;
}

class Game {
	private _players: Players = {};
	private _currPlayer = 1;
	private _board: Board;
	private _winner: string | undefined;
	constructor(board: Board, player1: Player, player2: Player) {
		this._board = board;
		this._players[1] = player1;
		this._players[2] = player2;
	}
	public rollDice(): void {
		if (this._winner) {
			throw new Error("Game has ended with player as " + this._winner);
		}
		const player = this._players[this._currPlayer];
		const rolledNum = player.rollDice(this._board);
		console.log({ rolledNum, _currPlayer: this._currPlayer });
		this._players[this._currPlayer] = player;

		if (player.position === 100) {
			this._winner = player.name;
			return;
		}

		if (rolledNum === 6) {
			return;
		}

		this._currPlayer = this._currPlayer === 1 ? 2 : 1;
	}
	get winner(): string | undefined {
		return this._winner;
	}
}

/*
 * const board = new Board(
	 * [{ source: 33, destination: 2 }],
	 * [{ source: 5, destination: 23 }]
 * );
 * const player1 = new Player("Arun");
 * const player2 = new Player("Tarun");
 * const game = new Game(board, player1, player2);
 * game.rollDice();
 * game.rollDice();
 * game.rollDice();
 * game.rollDice();
 * game.rollDice();
 * game.rollDice();
 * console.log(game);
 *
 * 21  22  23  24  25  26  27  28  29  30
 * 20  19  18  17  16  15  14  13  12  11
 * 1   2   3   4   5   6   7   8   9   10
 */

