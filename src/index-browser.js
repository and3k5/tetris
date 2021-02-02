import "./tetris/tetris.css";
import { game, extensions } from "tetris-core";
const { init: { init } } = game;

import "./tetris/flame.js";

import DocumentUtil from "./tetris/document-util.js";

import { WebGraphicEngine } from "./tetris/graphics/web/web-engine.js";

import { SoundController } from "./tetris/sound/sound-controller.js";

const { addon: { INIT_TYPES } } = extensions;

var container = "#container";
if (typeof (container) === "string") {
    container = window.document.body.querySelector(container);
}
container = new DocumentUtil(container);

const graphicEngine = new WebGraphicEngine({
    container: container,
});

const options = {};

var tetrisgame = init(null, graphicEngine);

if (options.debug === "1")
    require("./tetris/debug.js").initDebug(container.parentElement, container.el, tetrisgame);

if (options.sound !== "off")
    tetrisgame.registerAddon(new SoundController(), (ctrl, game) => {
        ctrl.init();
        game.addEvent("fx", (type, name) => {
            if (type !== "sound")
                return;
            ctrl.playSound(name);
        });
    }, INIT_TYPES.AFTER_INIT)