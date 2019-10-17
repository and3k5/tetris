import "core-js/stable";
import "regenerator-runtime/runtime";
import { defaultGame } from "./game-setup.js";
import TetrisGame from "./game.js";
import DocumentUtil from "./document-util.js";

import * as htmlLoad from "./game.html";

export function init(container) {
    var tetrisgame;

    if (typeof (container) === "string") {
        container = window.document.body.querySelector(container);
    }

    container = new DocumentUtil(container);

    for (var element of DocumentUtil.stringToElement(htmlLoad)) {
        container.append(element);
    }

    var setup = defaultGame();

    var url = new URL(location.href);
    if (url.searchParams.get("simulate") === "1")
        setup.simulator = true;

    if (url.searchParams.get("clickTick") === "1")
        setup.clickTick = true;

    var gameCanvas = container.querySelector("[data-target=gameCanvas]").el;
    var holdingCanvas = container.querySelector("[data-target=holdingCanvas]").el;
    var nextCanvas = container.querySelector("[data-target=nextCanvas]").el;
    var score = container.querySelector("[data-target=score]").el;

    tetrisgame = new TetrisGame(setup);
    tetrisgame.init(
        gameCanvas,
        holdingCanvas,
        nextCanvas,
        score
    );

    return tetrisgame;
}