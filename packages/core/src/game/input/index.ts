export class InputController {
    /**
     * @type {import("../game").TetrisGame}
     */
    #game;
    constructor(game) {
        this.#game = game;
    }

    smashDown() {
        if (this.#game.running !== true)
            return;
        this.#game.getMovingBrick().smashdown(true);
    }

    left() {
        if (this.#game.running !== true)
            return;
        this.#game.getMovingBrick().moveleft();
    }

    rotate() {
        if (this.#game.running !== true)
            return;
        this.#game.getMovingBrick().rotate();
    }

    right() {
        if (this.#game.running !== true)
            return;
        this.#game.getMovingBrick().moveright();
    }

    down() {
        if (this.#game.running !== true)
            return;
        this.#game.getMovingBrick().movedown();
    }

    hold() {
        if (this.#game.running !== true)
            return;
        this.#game.holdingShift();
    }
}