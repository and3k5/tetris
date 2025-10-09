import { TetrisGame } from "../../game";
import { Score } from "./simulate-rating";

export class Movement {
    x: number;
    y: number;
    brickMatrix: unknown;
    score: Score | null;
    constructor({ x, y, brickMatrix }: { x: number; y: number; brickMatrix: unknown }) {
        this.x = x;
        this.y = y;
        this.brickMatrix = brickMatrix;
        this.score = null;
    }
}

export class SimpleMovement extends Movement {
    rotation: number;
    needsHolding: boolean;
    holdingFired: boolean;
    constructor(options) {
        super(options);

        const { rotation, needsHolding } = options;

        this.rotation = rotation;
        this.needsHolding = needsHolding;
        this.holdingFired = false;
    }

    getNextInstruction() {
        const result = (game: TetrisGame) => {
            if (this.needsHolding === true && this.holdingFired !== true) {
                this.holdingFired = true;
                game.holdingShift();
                return;
            }

            const movingBrick = game.getMovingBrick();
            if (movingBrick.rotation === this.rotation && movingBrick.x === this.x) {
                game.input.smashDown();
                return;
            }

            game.moveTowards(this.x, this.rotation);
        };

        return result;
    }
}
