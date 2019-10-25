import TetrisGame from "../../game.js";

export default class GraphicEngineBase {
    #game;
    constructor() {
    }

    initialize() {
        throw new Exception("Missing implementation");
    }

    clear() {
        throw new Exception("Missing implementation");
    }

    setGame(game) {
        this.#game = game;
    }

    /**
     * @returns {TetrisGame}
     */
    get game() {
        return this.#game;
    }
}