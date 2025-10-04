export class Movement {
    constructor({ x, y, brickMatrix }) {
        this.x = x;
        this.y = y;
        this.brickMatrix = brickMatrix;
        /**
         * @type {import("./simulate-rating").Score}
         */
        this.score = null;
    }
}

export class SimpleMovement extends Movement {
    constructor(options) {
        super(options);

        const { rotation, needsHolding } = options;

        this.rotation = rotation;
        this.needsHolding = needsHolding;
        this.holdingFired = false;
    }

    getNextInstruction() {
        const movement = this;

        /**
         * Result function
         *
         * @param {import("../../game").TetrisGame} game 
         */
        const result = function (game) {
            if (movement.needsHolding === true && movement.holdingFired !== true) {
                movement.holdingFired = true;
                game.holdingShift();
                return;
            }

            /**
             * @type {import("../../../brick").Brick}
             */
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