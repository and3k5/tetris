import { TetrisGame } from "../game";
import { EngineBase } from "../engine";
import { EasyNextBrick } from "../logic/next-brick";
import { defaultGame, easyGame, easyGame2, ITetrisSetup, longPieceGame, shitGame } from "../setup";

// function optionParser() {
//     const options: Partial<Options> = {};
//     if (global.browser === true) {
//         const url = new URL(location.href);
//         options.setup = url.searchParams.get("setup");
//         options.next = url.searchParams.get("next");
//         options.simulate = url.searchParams.get("simulate");
//         options.clickTick = url.searchParams.get("clickTick") === "true";
//         options.logger = url.searchParams.get("logger");
//         options.view = url.searchParams.get("view");
//         options.debug = url.searchParams.get("debug");
//     } else if (global.node === true) {
//         const args = process.argv.concat();
//         args.splice(0, 2);

//         const getValue = function (args, name, def = undefined) {
//             for (const arg of args) {
//                 if (arg.indexOf("--" + name) === 0) {
//                     return arg.substring(name.length + 3);
//                 }
//             }
//             return def;
//         };

//         options.setup = getValue(args, "setup");
//         options.next = getValue(args, "next");
//         options.simulate = getValue(args, "simulate");
//         //options.clickTick = getValue(args,"clickTick");
//         options.logger = getValue(args, "logger");
//         //options.view = getValue(args,"view");
//         //options.debug = getValue(args,"debug");
//     }
//     return options;
// }

export class Options {
    setup: string | null = null;
    next: string | null = null;
    simulate: boolean | string | null = null;
    clickTick?: boolean = null;
    logger? = null;
    view? = null;
    debug? = null;
    sound?: null | "off" = null;
    constructor() {}
}

export function init(options: Options, engine: EngineBase) {
    let setup: ITetrisSetup;

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
        case "2":
            setup.simulator = true;
            setup.simulateMode = "fast";
            break;
        case "assistbug":
            {
                setup.simulator = true;
                setup.simulation = [];

                let time = 0;

                for (let i = 0; i < 5; i++) {
                    for (let j = 0; j < 4; j++) {
                        setup.simulation.push({
                            type: "nextRandom",
                            val: 0,
                            time: (time += 100),
                        });
                        setup.simulation.push({
                            type: "nextRandom",
                            val: 0,
                            time: (time += 100),
                        });
                    }
                    setup.simulation.push({
                        type: "nextRandom",
                        val: 0,
                        time: (time += 100),
                    });
                }
            }
            break;
    }

    if (options.clickTick === true) setup.clickTick = true;

    if (options.logger === "1") setup.logger = true;

    const tetrisgame = new TetrisGame(setup, null, engine);

    if (options.view === "lite") {
        tetrisgame.runEvent("setView", null, "lite");
    }

    tetrisgame.init();

    return tetrisgame;
}
