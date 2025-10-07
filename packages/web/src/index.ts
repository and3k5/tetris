import "./engine/style/tetris.css";
import { game, extensions } from "@tetris/core";
const { init: { init, Options } } = game;

import "./engine/style/flame.js";

import DocumentUtil from "./utils/document-util";

import { WebGraphicEngine } from "./engine";

import { SoundController } from "./engine/sound/sound-controller.js";

const { addon: { INIT_TYPES } } = extensions;

let container = "#container";
if (typeof (container) === "string") {
    container = window.document.body.querySelector(container);
}
container = new DocumentUtil(container);

const graphicEngine = new WebGraphicEngine({
    container: container,
});

const options = new Options();
const url = new URL(location.href);
if (url.searchParams.get("setup") != null)
    options.setup = url.searchParams.get("setup");

if (url.searchParams.get("next") != null)
    options.next = url.searchParams.get("next");

if (url.searchParams.get("simulate") != null)
    options.simulate = url.searchParams.get("simulate") === "1" ? true : url.searchParams.get("simulate");

if (url.searchParams.get("clickTick") != null)
    options.clickTick = url.searchParams.get("clickTick") === "1";

if (url.searchParams.get("logger") != null)
    options.logger = url.searchParams.get("logger");

if (url.searchParams.get("view") != null)
    options.view = url.searchParams.get("view");

if (url.searchParams.get("debug") != null)
    options.debug = url.searchParams.get("debug");

const tetrisgame = init(options, graphicEngine);

if (options.debug === "1")
    require("./engine/debug").initDebug(container.parentElement, container.el, tetrisgame);

if (options.sound !== "off")
    tetrisgame.registerAddon(new SoundController(), (ctrl, game) => {
        ctrl.init();
        game.addEvent("fx", (type, name) => {
            if (type !== "sound")
                return;
            ctrl.playSound(name);
        });
    }, INIT_TYPES.AFTER_INIT)