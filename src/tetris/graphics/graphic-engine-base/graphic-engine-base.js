import TetrisGame from "../../game.js";

export default class GraphicEngineBase {
    #game;
    constructor() {
    }

    initialize() {
        throw new Error("Missing implementation");
    }

    initializeInput() {
        // virtual
    }

    initRender() {
        throw new Error("Missing implementation")
    }

    clear() {
        throw new Error("Missing implementation");
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