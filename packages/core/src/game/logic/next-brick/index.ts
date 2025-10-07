import { getPossibleMoves, cloneGame } from "../simulation";
import { sortMovements } from "../simulation/simulate-rating";

export class NextBrick {
    constructor() {}

    nextBrick(game) {
        var previousRandom = game.nextRandom;
        var nextRandom = previousRandom;

        while (nextRandom === previousRandom)
            nextRandom = Math.round(Math.random() * (game.brickforms.length - 1));

        return nextRandom;
    }
}

export class StaticNextBrick extends NextBrick {
    private _v;
    constructor(v) {
        super();
        this._v = v;
    }

    nextBrick() {
        return this._v;
    }
}

export class EasyNextBrick extends NextBrick {
    private _fallback;
    constructor(fallback = null) {
        super();
        this._fallback = fallback || new NextBrick();
    }

    nextBrick(game) {
        var latestBrick = game.bricks.concat().sort((a, b) => b.id - a.id)[0];
        var movements = [];
        for (var i = 0; i < game.brickforms.length; i++) {
            if (latestBrick != null && i == latestBrick.index) continue;
            var move = this.getPossibleMovesForType(game, i)[0];
            movements.push({ i, move });
        }
        var best = sortMovements(movements)[0];

        //console.log(best.move.brick.game.nextBrick);
        return best.move.brick.index;
    }

    getPossibleMovesForType(game, index) {
        var setupChanges = {};
        setupChanges.nextBrick = new StaticNextBrick(index);
        var clone = cloneGame(game, setupChanges);
        clone.addNewBrick();
        var moves = getPossibleMoves(clone);
        //console.log(moves);
        return moves;
    }
}
