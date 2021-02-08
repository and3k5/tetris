import { TetrisGame, logic, setup } from "../"
const {  nextBrick: { EasyNextBrick } } = logic;
const {  defaultGame, easyGame, longPieceGame, shitGame, easyGame2 } = setup;

function optionParser() {
    /**
     * @type {Options}
     */
    var options = {};
    if (global.browser === true) {
        var url = new URL(location.href);
        options.setup = url.searchParams.get("setup");
        options.next = url.searchParams.get("next");
        options.simulate = url.searchParams.get("simulate");
        options.clickTick = url.searchParams.get("clickTick");
        options.logger = url.searchParams.get("logger");
        options.view = url.searchParams.get("view");
        options.debug = url.searchParams.get("debug");
    } else if (global.node === true) {
        var args = process.argv.concat();
        args.splice(0, 2);

        var getValue = function (args, name, def = undefined) {
            for (var arg of args) {
                if (arg.indexOf("--" + name) === 0) {
                    return arg.substring(name.length + 3);
                }
            }
            return def;
        };

        options.setup = getValue(args, "setup");
        options.next = getValue(args, "next");
        options.simulate = getValue(args, "simulate");
        //options.clickTick = getValue(args,"clickTick");
        options.logger = getValue(args, "logger");
        //options.view = getValue(args,"view");
        //options.debug = getValue(args,"debug");
    }
    return options;
}


export class Options {
    /**
     * @type {string}
     */
    setup = null;
    /**
     * @type {string}
     */
    next = null;
    /**
     * @type {boolean,string}
     */
    simulate = null;
    /**
     * @type {boolean}
     */
    clickTick = null;
    logger = null;
    view = null;
    debug = null;
    constructor() {

    }
}

/**
 * 
 * @param {Options} options 
 * @param {any} engine 
 */
export function init(options, engine) {
    var tetrisgame;

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

    switch (options.next) {
        case "ez":
            setup.nextBrick = new EasyNextBrick();
            break;
        default:
            break;
    }

    switch (options.simulate) {
        case true:
            setup.simulator = true;
            break;
        case "assistbug":
            setup.simulator = true;
            setup.simulation = [


            ];

            var time = 0;

            for (var i = 0; i < 5; i++) {
                for (var j = 0; j < 4; j++) {
                    setup.simulation.push({
                        type: "nextRandom",
                        val: 0,
                        time: time += 100,
                    });
                    setup.simulation.push({
                        type: "nextRandom",
                        val: 0,
                        time: time += 100,
                    });
                }
                setup.simulation.push({
                    type: "nextRandom",
                    val: 0,
                    time: time += 100,
                });
            }
            break;
    }


    if (options.clickTick === true)
        setup.clickTick = true;

    if (options.logger === "1")
        setup.logger = true;

    if (options.view === "lite")
        window.document.body.classList.add("lite-view");

    // var gameCanvas = container.querySelector("[data-target=gameCanvas]").el;
    // var holdingCanvas = container.querySelector("[data-target=holdingCanvas]").el;
    // var nextCanvas = container.querySelector("[data-target=nextCanvas]").el;
    // var score = container.querySelector("[data-target=score]").el;

    tetrisgame = new TetrisGame(setup, null, engine);
    

    tetrisgame.init();

    return tetrisgame;
}