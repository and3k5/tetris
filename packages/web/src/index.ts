import "./engine/style/tetris.css";

import "./engine/style/flame";

import { createApp } from "vue";
import Game from "./engine/game.vue";
import { Options } from "@tetris/core/game/init";
import { initOptionsFromUrl } from "./initOptionsFromUrl";
import { SoundController } from "./engine/sound";

const container = document.querySelector<HTMLDivElement>("#container");

createApp(Game).mount(container);

const gameCanvas = container.querySelector<HTMLCanvasElement>("[data-target=gameCanvas]");
const holdingCanvas = container.querySelector<HTMLCanvasElement>("[data-target=holdingCanvas]");
const nextCanvas = container.querySelector<HTMLCanvasElement>("[data-target=nextCanvas]");
const score = container.querySelector("[data-target=score]");

const gameOffscreenCanvas = gameCanvas.transferControlToOffscreen();
const holdingOffscreenCanvas = holdingCanvas.transferControlToOffscreen();
const nextOffscreenCanvas = nextCanvas.transferControlToOffscreen();

const worker = new Worker(new URL("./web-worker.ts", import.meta.url), {
    type: "module",
});

export const options = new Options();
const url = new URL(location.href);
initOptionsFromUrl(url);

const sndCtrl = new SoundController();

worker.postMessage(
    {
        type: "init",
        gameOffscreenCanvas,
        holdingOffscreenCanvas,
        nextOffscreenCanvas,
        options,
    },
    [gameOffscreenCanvas, holdingOffscreenCanvas, nextOffscreenCanvas],
);

worker.addEventListener("message", (event) => {
    const { type } = event.data;
    if (type === "inited") {
        console.log("Tetris game initialized in worker");
    } else if (type === "init-input") {
        gameCanvas.addEventListener("click", function () {
            worker.postMessage({ type: "input", action: "sendTick" });
        });

        window.addEventListener(
            "keydown",
            function (e) {
                switch (e.keyCode) {
                    case 37:
                        // left
                        e.preventDefault();
                        worker.postMessage({ type: "input", action: "left" });
                        break;
                    case 38:
                        // up
                        e.preventDefault();
                        worker.postMessage({ type: "input", action: "rotate" });
                        break;
                    case 39:
                        // right
                        e.preventDefault();
                        worker.postMessage({ type: "input", action: "right" });
                        break;
                    case 40:
                        // down
                        e.preventDefault();
                        worker.postMessage({ type: "input", action: "down" });
                        break;
                    case 32:
                        // space
                        e.preventDefault();
                        if (e.repeat !== true)
                            worker.postMessage({ type: "input", action: "smash" });
                        break;
                    case 27:
                        // escape
                        e.preventDefault();
                        // if (game.running) {
                        //     // ingame
                        //     game.runEvent("fx", null, "sound", "menuback");
                        // }
                        break;
                    case 16:
                        // shift
                        e.preventDefault();
                        worker.postMessage({ type: "input", action: "hold" });
                        break;
                }
            },
            false,
        );

        let touchStart = null;

        gameCanvas.addEventListener("touchstart", function (event) {
            const touch = event.changedTouches[0];
            touchStart = { x: touch.screenX, y: touch.screenY };
        });
        gameCanvas.addEventListener("touchend", function (event) {
            const touch = event.changedTouches[0];
            const touchEnd = { x: touch.screenX, y: touch.screenY };

            const deltaX = touchEnd.x - touchStart.x;
            const deltaY = touchEnd.y - touchStart.y;
            const rad = Math.atan2(deltaY, deltaX);
            let deg = rad * (180 / Math.PI);

            while (deg < 0) deg += 360;

            if (deg > 120 && deg < 220) {
                worker.postMessage({ type: "input", action: "left" });
            } else if (deg > 340 || deg < 40) {
                worker.postMessage({ type: "input", action: "right" });
            } else if (deg < 115 && deg > 65) {
                worker.postMessage({ type: "input", action: "smash" });
            } else {
                console.debug(deg);
            }
        });
        holdingCanvas.addEventListener("click", function () {
            worker.postMessage({ type: "input", action: "holdingShift" });
        });
    } else if (type === "init-fx") {
        sndCtrl.init();
    } else if (type === "fx") {
        const name = event.data.name;
        sndCtrl.playSound(name);
    } else if (type === "update-score") {
        const scoreValue = event.data.score;
        score.innerHTML = scoreValue;
    } else if (type === "restart") {
        window.location.reload();
    }
});
