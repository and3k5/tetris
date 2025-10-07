export class InputController {
    /**
     * @type {import("../game").TetrisGame}
     */
    private _game;
    constructor(game) {
        this._game = game;
    }

    smashDown() {
        if (this._game.running !== true) return;
        this._game.getMovingBrick().smashdown(true);
    }

    left() {
        if (this._game.running !== true) return;
        this._game.getMovingBrick().moveleft();
    }

    rotate() {
        if (this._game.running !== true) return;
        this._game.getMovingBrick().rotate();
    }

    right() {
        if (this._game.running !== true) return;
        this._game.getMovingBrick().moveright();
    }

    down() {
        if (this._game.running !== true) return;
        this._game.getMovingBrick().movedown();
    }

    hold() {
        if (this._game.running !== true) return;
        this._game.holdingShift();
    }
}
