import { game } from "tetris-core";
const { init: { init } } = game;

const options = {};

import { NodeGraphicEngine } from "./engine.js";
const graphicEngine = new NodeGraphicEngine();

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
options.simulate = getValue(args, "simulate") === "true";
options.logger = getValue(args, "logger");

init(options, graphicEngine);