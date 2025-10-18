import { WebGraphicEngine } from "./engine/WebGraphicEngine";
import { init } from "@tetris/core/game/init";
import { INIT_TYPES } from "@tetris/core/extensions/addon";
import { executeTick } from "@tetris/core/game/game-controller";

let graphicEngine: WebGraphicEngine | undefined = undefined;
let tetrisgame: ReturnType<typeof init> | undefined = undefined;

addEventListener("message", (event) => {
    const { type } = event.data;
    if (type === "init") {
        const { options, gameOffscreenCanvas, holdingOffscreenCanvas, nextOffscreenCanvas } =
            event.data;
        graphicEngine = new WebGraphicEngine({
            gameOffscreenCanvas,
            holdingOffscreenCanvas,
            nextOffscreenCanvas,
        });
        tetrisgame = init(options, graphicEngine);

        tetrisgame.addEvent("restart", () => {
            postMessage({ type: "restart" });
        });

        tetrisgame.addEvent("setView", (name) => {
            postMessage({ type: "setView", name });
        });

        if (options.sound !== "off") {
            postMessage({ type: "init-fx" });
            tetrisgame.registerAddon(
                {},
                (ctrl, game) => {
                    game.addEvent("fx", (type, name) => {
                        if (type !== "sound") return;
                        postMessage({ type: "fx", name: name });
                    });
                },
                INIT_TYPES.AFTER_INIT,
            );
        }

        postMessage({ type: "inited" });
    } else if (type === "input") {
        const game = tetrisgame;
        if (!game) return;

        switch (event.data.action) {
            case "left":
                game.input.left();
                break;
            case "right":
                game.input.right();
                break;
            case "down":
                game.input.down();
                break;
            case "rotate":
                game.input.rotate();
                break;
            case "smash":
                game.input.smashDown();
                break;
            case "holdingShift":
                game.holdingShift();
                break;
            case "hold":
                game.input.hold();
                break;
            case "sendTick":
                if (game.setup.clickTick === true) executeTick(game);
                break;
        }
    }
});

// if (options.debug === "1") {
//     import("./engine/debug").then((mod) =>
//         mod.initDebug(container.parentElement, container.el, tetrisgame),
//     );
// }
