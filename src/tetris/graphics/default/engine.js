import * as htmlLoad from "./game.html";
import GraphicEngineBase from "../graphic-engine-base/graphic-engine-base.js";
import DocumentUtil from "../../document-util.js";

export default class DefaultGraphicEngine extends GraphicEngineBase {
    #brickSize = 30;

    #gameCanvas;
    #holdingCanvas;
    #nextCanvas;
    #gameCtx;
    #holdingCtx;
    #nextCtx;
    #score;

    get score() {
        return this.#score;
    }

    get brickSize() {
        return this.#brickSize;
    }

    get gameCanvas() {
        return this.#gameCanvas;
    }

    get holdingCanvas() {
        return this.#holdingCanvas;
    }

    get nextCanvas() {
        return this.#nextCanvas;
    }

    constructor(options) {
        super();

        var container = 
            new DocumentUtil(options.container)
                .append(DocumentUtil.stringToElement(htmlLoad));
        
        this.#gameCanvas = container.querySelector("[data-target=gameCanvas]").el;
        this.#holdingCanvas = container.querySelector("[data-target=holdingCanvas]").el;
        this.#nextCanvas = container.querySelector("[data-target=nextCanvas]").el;
        this.#score = container.querySelector("[data-target=score]").el;
    }

    clear() {

    }
}
