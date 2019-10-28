import { getPossibleMoves } from "../simulate.js";

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
    constructor() {
        super();
    }

    nextBrick(game) {
        var movements = [];
        for (var i = 0;i<game.brickforms.length;i++) {
            var move = this.getPossibleMovesForType(game,i)[0];
            movements.push({i,move});
        }
        
    }

    getPossibleMovesForType(game,index) {
        var setupChanges = {};
        setupChanges.nextBrick = new StaticNextBrick(index);
        var moves = getPossibleMoves(game,setupChanges);
        console.log(moves);
        return moves;
    }
}