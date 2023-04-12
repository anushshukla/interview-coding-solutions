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

		let highestPositions;
		let lowestPositions;
		if (ladderPositions.length > snakePositions.length) {
			highestPositions = ladderPositions;
			lowestPositions = snakePositions;
		} else {
			highestPositions = snakePositions;
			lowestPositions = ladderPositions;
		}

		const positionsHashmap: PositionUpDown = {};

		for (const position of highestPositions) {
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

			// @ToDo improve below
			const isConflicting = lowestPositions.find(
				(lowestPosition) => lowestPositions.source === sourcePos
			);
			if (isConflicting) {
				throw new Error("Snake and ladder should be on different positions");
			}

			positionsHashmap[sourcePos] = destinationPos;
		}
		// validation for diagonal tail values for ladder
		this._positions = positionsHashmap;
	}
}

class Player {
	private _name: string;
	private _position = 0;
	private _size = 6;
	public constructor(name: string) {
		this._name = name;
	}
	public rollDice(board: Board): void {
		const number = Math.floor(Math.random() * (this._size + 1));
		let newPos = this._position + number;
		if (newPos > 100) {
			return;
		}
		this._position = board[newPos] || newPos;
	}
	get position(): number {
		return this._position;
	}
	get name(): string {
		return this._name;
	}
}

interface Players {
	[key: number]: Player;
}

class Game {
	private _players: Players;
	private _nextPlayer = 1;
	private _board: Board;
	private _winner: string;
	constructor(board: Board, player1: Player, player2: Player) {
		this._board = board;
		this._players[1] = player1;
		this._players[2] = player2;
	}
	public _rollDice(board: Board): void {
		if (this._winner) {
			throw new Error("Game has ended with player as " + this._winner);
		}
		const player = this._players[this._nextPlayer];
		player.rollDice(board);
		this._players[this._nextPlayer] = player;
		this._nextPlayer = this._nextPlayer === 1 ? 2 : 1;
		if (this._players[this._nextPlayer].position === 100) {
			this._winner = player.name;
		}
	}
	get winner(): string {
		return this._winner;
	}
}

/*
 * const board = new Board({33: 2, 44: 7, 99: 1, 88: 8, }, { 6: 33, 9: 92  });
 * const player1 = new Player("Anush");
 * const player2 = new Player("Avick");
 * const game = new Game(board, player1, player2);
 * game._rollDice(board);
 * game._rollDice(board);
 *
 * 21  22  23  24  25  26  27  28  29  30
 * 20  19  18  17  16  15  14  13  12  11
 * 1   2   3   4   5   6   7   8   9   10
 */
