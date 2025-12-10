import { NodeGraphicEngine } from "./engine";
import { init, Options } from "@tetris/core/game/init";

const graphicEngine = new NodeGraphicEngine();

const args = process.argv.concat();
args.splice(0, 2);

const getValue = function (args, name, def = undefined) {
    for (const arg of args) {
        if (arg.indexOf("--" + name) === 0) {
            return arg.substring(name.length + 3);
        }
    }
    return def;
};

const options: Options = {
    setup: getValue(args, "setup"),
    next: getValue(args, "next"),
    simulate: getValue(args, "simulate") === "true",
    logger: getValue(args, "logger"),
};

init(options, graphicEngine);
