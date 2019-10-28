import { getPossibleMoves, sortMovements, cloneGame } from "../simulate.js";

export class NextBrick {
    constructor() {

    }

    nextBrick(game) {
        return Math.round(Math.random() * (game.brickforms.length - 1));
    }
}

export class StaticNextBrick extends NextBrick {
    #v;
    constructor(v) {
        super();
        this.#v = v;
    }

    nextBrick() {
        return this.#v;
    }
}

export class EasyNextBrick extends NextBrick {
    #fallback;
    constructor(fallback = null) {
        super();
        this.#fallback = fallback || new NextBrick();
    }

    nextBrick(game) {
        var latestBricks = game.bricks.filter(b => typeof(b.index) === "number");

        var latestBrick = latestBricks[latestBricks.length-1];

        var movements = [];
        for (var i = 0;i<game.brickforms.length;i++) {
            if (latestBrick != null && i == latestBrick.index)
                continue;
            var move = this.getPossibleMovesForType(game,i)[0];
            movements.push({i,move});
        }
        var best = sortMovements(movements)[0];
        
        console.log(best.move.brick.game.nextBrick);
        return best.move.brick.index;
    }

    getPossibleMovesForType(game,index) {
        var setupChanges = {};
        setupChanges.nextBrick = new StaticNextBrick(index);
        var clone = cloneGame(game,setupChanges);
        clone.addNewBrick();
        var moves = getPossibleMoves(clone);
        //console.log(moves);
        return moves;
    }
}