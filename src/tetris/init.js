import "core-js/stable";
import "regenerator-runtime/runtime";
import { defaultGame, easyGame, longPieceGame, shitGame, easyGame2 } from "./game-setup.js";
import TetrisGame from "./game.js";
import DocumentUtil from "./document-util.js";

import { EasyNextBrick } from "./logic/next-brick.js";
import * as sound from "./sound.js";

function optionParser() {
    var options = {};
    if (global.browser === true) {
        var url = new URL(location.href);
        options.setup = url.searchParams.get("setup");
        options.sound = url.searchParams.get("sound");
        options.next = url.searchParams.get("next");
        options.simulate = url.searchParams.get("simulate");
        options.clickTick = url.searchParams.get("clickTick");
        options.logger = url.searchParams.get("logger");
        options.view = url.searchParams.get("view");
        options.debug = url.searchParams.get("debug");
    } else if (global.node === true) {
        var args = process.argv.concat();
        args.splice(0,2);

        var getValue = function (args,name, def = undefined) {
            for (var arg of args) {
                if (arg.indexOf("--"+name) === 0) {
                    return arg.substring(name.length+3);
                }
            }
            return def;
        };

        options.setup = getValue(args,"setup");
        //options.sound = getValue(args,"sound");
        options.next = getValue(args,"next");
        options.simulate = getValue(args,"simulate");
        //options.clickTick = getValue(args,"clickTick");
        options.logger = getValue(args,"logger");
        //options.view = getValue(args,"view");
        //options.debug = getValue(args,"debug");
    }
    return options;
}

export function init(container) {
    var tetrisgame;

    if (typeof (container) === "string") {
        container = window.document.body.querySelector(container);
    }

    var options = optionParser();

    container = new DocumentUtil(container);
                //.append(DocumentUtil.stringToElement(htmlLoad));

    var setup;

    switch (options.setup) {
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

    switch (options.sound) {
        case "off":
            sound.deactivate();
            break;
        default:
            break;
    }

    switch (options.next) {
        case "ez":
            setup.nextBrick = new EasyNextBrick();
            break;
        default:
            break;
    }

    switch (options.simulate) {
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


    if (options.clickTick === "1")
        setup.clickTick = true;

    if (options.logger === "1")
        setup.logger = true;

    if (options.view === "lite")
        window.document.body.classList.add("lite-view");

    let graphicEngine = null;

    if (global.browser === true) {
        var wge = require("./graphics/web/web-engine.js").WebGraphicEngine;
        graphicEngine = new wge({
            container: container,
        });
    }
    else if (global.node === true) {
        var nge = new require("./graphics/node/node-engine.js").NodeGraphicEngine;
        graphicEngine = new nge();
    }

    

    // var gameCanvas = container.querySelector("[data-target=gameCanvas]").el;
    // var holdingCanvas = container.querySelector("[data-target=holdingCanvas]").el;
    // var nextCanvas = container.querySelector("[data-target=nextCanvas]").el;
    // var score = container.querySelector("[data-target=score]").el;

    tetrisgame = new TetrisGame(setup, null, graphicEngine);

    if (global.browser === true && options.debug === "1")
        require("./debug.js").initDebug(container.parentElement,container.el,tetrisgame);

    tetrisgame.init();

    return tetrisgame;
}