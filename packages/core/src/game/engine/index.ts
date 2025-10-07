import { TetrisGame } from "../game";

export class EngineBase {
    private _game: TetrisGame;
    constructor() {}

    initialize() {
        throw new Error("Missing implementation");
    }

    initializeInput() {
        // virtual
    }

    initRender() {
        throw new Error("Missing implementation");
    }

    clear() {
        throw new Error("Missing implementation");
    }

    setGame(game) {
        this._game = game;
    }

    get game() {
        return this._game;
    }
}
