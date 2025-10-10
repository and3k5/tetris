import "./engine/style/tetris.css";
import { extensions } from "@tetris/core";

import "./engine/style/flame";

import { WebGraphicEngine } from "./engine";

import { SoundController } from "./engine/sound/sound-controller";
import { init, Options } from "@tetris/core/game/init";
import { initOptionsFromUrl } from "./initOptionsFromUrl";

const {
    addon: { INIT_TYPES },
} = extensions;

const container = document.querySelector<HTMLDivElement>("#container");

const graphicEngine = new WebGraphicEngine({
    container: container,
});

export const options = new Options();
const url = new URL(location.href);
initOptionsFromUrl(url);
const tetrisgame = init(options, graphicEngine);

// if (options.debug === "1") {
//     import("./engine/debug").then((mod) =>
//         mod.initDebug(container.parentElement, container.el, tetrisgame),
//     );
// }

if (options.sound !== "off")
    tetrisgame.registerAddon(
        new SoundController(),
        (ctrl, game) => {
            ctrl.init();
            game.addEvent("fx", (type, name) => {
                if (type !== "sound") return;
                ctrl.playSound(name);
            });
        },
        INIT_TYPES.AFTER_INIT,
    );
