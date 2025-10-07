import { TetrisGame } from "../game";

export class InputController {
    private _game: TetrisGame;
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
