import "core-js/stable";
import "regenerator-runtime/runtime";
import { defaultGame, easyGame, longPieceGame, shitGame } from "./game-setup.js";
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

    var setup;

    var url = new URL(location.href);
    switch (url.searchParams.get("setup")) {
        case "ez":
            setup = easyGame();
            break;
        case "long":
            setup = longPieceGame();
            break;
        case "shit":
            setup = shitGame();
            break;
        default:
            setup = defaultGame();
            break;
    }

    switch (url.searchParams.get("simulate")) {
        case "1":
            setup.simulator = true;
            break;
        case "assistbug":
            setup.simulator = true;
            setup.simulation = [


            ];
            break;
    }


    if (url.searchParams.get("clickTick") === "1")
        setup.clickTick = true;

    if (url.searchParams.get("view") === "lite")
        container.el.ownerDocument.body.classList.add("lite-view");

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