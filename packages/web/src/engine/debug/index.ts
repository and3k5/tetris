import { WebGraphicEngine } from "..";
import DocumentUtil from "../../utils/document-util";
import * as htmlLoad from "./debug.html";
import { Color } from "@tetris/core/src/utils/color";

export function initDebug(
    parent: any,
    container: any,
    game: import("../../../../core/src/game").TetrisGame,
) {
    const debugContainer = new DocumentUtil(container);

    const element = DocumentUtil.stringToElement(htmlLoad);
    debugContainer.append(element);

    const clickTick = debugContainer.querySelector("[data-target='clickTick']");
    clickTick.el.addEventListener("change", function (ev) {
        game.setup.clickTick = ev.target.checked;
    });
    clickTick
        .react(() => game.setup.clickTick)
        .addHandler((v) => {
            clickTick.el.checked = v;
        });

    const simulationViewer = debugContainer.querySelector("[data-target='simulation-viewer']");

    if (game.simulator != null) {
        let selectedValue = -1;
        let movements = [];

        const graphicsEngine: WebGraphicEngine = game.graphicsEngine;

        const cloneCtx = document.createElement("canvas").getContext("2d");
        cloneCtx.canvas.style.position = "absolute";
        cloneCtx.canvas.style.top = "0px";
        cloneCtx.canvas.style.left = "0px";
        cloneCtx.canvas.style.width = "100%";
        cloneCtx.canvas.style.pointerEvents = "none";
        graphicsEngine.gameCtx.canvas.parentElement.appendChild(cloneCtx.canvas);

        const calldraw = function () {
            console.log("draw: " + selectedValue);

            if (selectedValue < 0) {
                console.log("TODO CLEAR");
            } else {
                const movement = movements[selectedValue];
                console.log(movement);
                cloneCtx.canvas.width = graphicsEngine.gameCtx.canvas.width;
                cloneCtx.canvas.height = graphicsEngine.gameCtx.canvas.height;

                for (let y = 0; y < game.height; y++) {
                    for (let x = 0; x < game.width; x++) {
                        if (movement.brickMatrix[y][x] === true) {
                            const color = new Color(255, 0, 0, 1);
                            graphicsEngine.drawSquare(cloneCtx, x, y, color);
                        }
                    }
                }
            }
        };

        const selector = simulationViewer.querySelector("[data-target='simulationSelector']");
        selector
            .react(() => movements)
            .addHandler(() => {
                console.log("UPDATED MOVEMENTS");
                selector.el.max = movements.length - 1;
                selector.el.value = 0;
                calldraw();
            });

        game.simulator.addEvent("update-movements", function (m) {
            movements = m;
        });

        console.log("simulator is enabled");

        movements = game.simulator.movements;

        selector.el.addEventListener("input", function (ev) {
            selectedValue = ev.target.value;
            calldraw();
        });

        const upBtn = simulationViewer.querySelector("[data-target='sim-up']");
        upBtn.el.addEventListener("click", function () {
            selectedValue = selectedValue + 1;
            if (selectedValue > movements.length) selectedValue = movements.length;
            selector.el.value = selectedValue;
            calldraw();
        });
        const downBtn = simulationViewer.querySelector("[data-target='sim-down']");
        downBtn.el.addEventListener("click", function () {
            selectedValue = selectedValue - 1;
            if (selectedValue < 0) selectedValue = 0;
            selector.el.value = selectedValue;
            calldraw();
        });
    } else {
        console.log("simulator is not enabled");
        if (
            "style" in simulationViewer &&
            typeof simulationViewer.style === "object" &&
            simulationViewer.style !== null &&
            "display" in simulationViewer.style
        ) {
            simulationViewer.style.display = "none";
        }
    }

    container.parentNode.insertBefore(debugContainer.el, container.nextSibling);
}
