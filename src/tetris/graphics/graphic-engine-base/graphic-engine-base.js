export default class GraphicEngineBase {
    #game;
    constructor(game) {
        this.#game = game;
    }

    initialize() {
        throw new Exception("Missing implementation");
    }

    clear() {
        throw new Exception("Missing implementation");
    }
}