import { TetrisGame } from "../../game";
import { Score } from "./simulate-rating";

export class Movement {
    x: any;
    y: any;
    brickMatrix: any;
    score: Score | null;
    constructor({ x, y, brickMatrix }) {
        this.x = x;
        this.y = y;
        this.brickMatrix = brickMatrix;
        this.score = null;
    }
}

export class SimpleMovement extends Movement {
    rotation: any;
    needsHolding: any;
    holdingFired: boolean;
    constructor(options) {
        super(options);

        const { rotation, needsHolding } = options;

        this.rotation = rotation;
        this.needsHolding = needsHolding;
        this.holdingFired = false;
    }

    getNextInstruction() {
        const movement = this;

        const result = function (game: TetrisGame) {
            if (movement.needsHolding === true && movement.holdingFired !== true) {
                movement.holdingFired = true;
                game.holdingShift();
                return;
            }

            const movingBrick = game.getMovingBrick();
            if (movingBrick.rotation === movement.rotation && movingBrick.x === movement.x) {
                game.input.smashDown();
                return;
            }

            game.moveTowards(movement.x, movement.rotation);
        };

        return result;
    }
}
