
import "./engine/style/flame";

import { WebGraphicEngine } from "./engine";

// import { SoundController } from "./engine/sound/sound-controller";
import { init, Options } from "@tetris/core/game/init";


postMessage({ type: "ready" });
addEventListener("message", (event) => {
    if (event.data.code === "start") {

        const options = new Options();
        Object.assign(options, event.data.options);

        const gameCanvasOffscreen = event.data.gameCanvasOffscreen;
        const holdingCanvasOffscreen = event.data.holdingCanvasOffscreen;
        const nextCanvasOffscreen = event.data.nextCanvasOffscreen;

        const gameCtx = gameCanvasOffscreen.getContext("2d");
        const holdingCtx = holdingCanvasOffscreen.getContext("2d");
        const nextCtx = nextCanvasOffscreen.getContext("2d");

        const graphicEngine = new WebGraphicEngine({
            gameCtx,
            holdingCtx,
            nextCtx,
        });
        const tetrisgame = init(options, graphicEngine);



    }
})

// if (options.debug === "1") {
//     import("./engine/debug").then((mod) =>
//         mod.initDebug(container.parentElement, container.el, tetrisgame),
//     );
// }

// if (options.sound !== "off")
//     tetrisgame.registerAddon(
//         new SoundController(),
//         (ctrl, game) => {
//             ctrl.init();
//             game.addEvent("fx", (type, name) => {
//                 if (type !== "sound") return;
//                 ctrl.playSound(name);
//             });
//         },
//         INIT_TYPES.AFTER_INIT,
//     );

