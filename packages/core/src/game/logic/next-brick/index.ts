import { getPossibleMoves, cloneGame } from "../simulation";
import { sortMovements } from "../simulation/simulate-rating";

export class NextBrick {
    constructor() {}

    nextBrick(game) {
        const previousRandom = game.nextRandom;
        let nextRandom = previousRandom;

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
        const latestBrick = game.bricks.concat().sort((a, b) => b.id - a.id)[0];
        const movements = [];
        for (let i = 0; i < game.brickforms.length; i++) {
            if (latestBrick != null && i == latestBrick.index) continue;
            const move = this.getPossibleMovesForType(game, i)[0];
            movements.push({ i, move });
        }
        const best = sortMovements(movements)[0];

        //console.log(best.move.brick.game.nextBrick);
        return best.move.brick.index;
    }

    getPossibleMovesForType(game, index) {
        const setupChanges = {
            nextBrick: new StaticNextBrick(index),
        };
        const clone = cloneGame(game, setupChanges);
        clone.addNewBrick();
        const moves = getPossibleMoves(clone);
        //console.log(moves);
        return moves;
    }
}
