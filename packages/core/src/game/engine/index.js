export class EngineBase {
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
     * @returns {import("@tetris/core").game.TetrisGame}
     */
    get game() {
        return this.#game;
    }
}