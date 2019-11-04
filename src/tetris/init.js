import "core-js/stable";
import "regenerator-runtime/runtime";
import { defaultGame, easyGame, longPieceGame, shitGame, easyGame2 } from "./game-setup.js";
import TetrisGame from "./game.js";
import DocumentUtil from "./document-util.js";
import { initDebug } from "./debug.js";
import { DefaultGraphicEngine } from "./graphics/default/engine.js";

import * as htmlLoad from "./game.html";
import { EasyNextBrick } from "./logic/next-brick.js";
import * as sound from "./sound.js";

export function init(container) {
    var tetrisgame;

    if (typeof (container) === "string") {
        container = window.document.body.querySelector(container);
    }

    container = new DocumentUtil(container);
                //.append(DocumentUtil.stringToElement(htmlLoad));

    var setup;

    var url = new URL(location.href);
    switch (url.searchParams.get("setup")) {
        case "ez":
            setup = easyGame();
            break;
        case "ez2":
            setup = easyGame2();
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

    switch (url.searchParams.get("sound")) {
        case "off":
            sound.deactivate();
            break;
        default:
            break;
    }

    switch (url.searchParams.get("next")) {
        case "ez":
            setup.nextBrick = new EasyNextBrick();
            break;
        default:
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

            var time = 0;

            for (var i = 0;i<5;i++) {
                for (var j = 0;j<4;j++) {
                    setup.simulation.push({
                        type: "nextRandom",
                        val: 0,
                        time: time+=100,
                    });
                    setup.simulation.push({
                        type: "nextRandom",
                        val: 0,
                        time: time+=100,
                    });
                }
                setup.simulation.push({
                    type: "nextRandom",
                    val: 0,
                    time: time+=100,
                });
            }
            break;
    }


    if (url.searchParams.get("clickTick") === "1")
        setup.clickTick = true;

    if (url.searchParams.get("logger") === "1")
        setup.logger = true;

    if (url.searchParams.get("view") === "lite")
        window.document.body.classList.add("lite-view");

    const graphicEngine = new DefaultGraphicEngine({
        container: container,
    });

    // var gameCanvas = container.querySelector("[data-target=gameCanvas]").el;
    // var holdingCanvas = container.querySelector("[data-target=holdingCanvas]").el;
    // var nextCanvas = container.querySelector("[data-target=nextCanvas]").el;
    // var score = container.querySelector("[data-target=score]").el;

    tetrisgame = new TetrisGame(setup, null, graphicEngine);

    if (url.searchParams.get("debug") === "1")
        initDebug(container.parentElement,container.el,tetrisgame);

    tetrisgame.init();

    return tetrisgame;
}