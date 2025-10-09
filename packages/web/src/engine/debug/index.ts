import { TetrisGame } from "@tetris/core/game";
import { WebGraphicEngine } from "..";
import { createReactor } from "../../utils/document-util";
import { default as htmlLoad } from "./debug.html";
import { Color } from "@tetris/core/utils/color";

export function initDebug(
    parent: never,
    container: HTMLElement,
    game: TetrisGame<WebGraphicEngine>,
) {
    const debugContainer = container;

    const domParser = new DOMParser();
    const htmlLoadDocument = domParser.parseFromString(htmlLoad, "text/html");

    for (const element of htmlLoadDocument.body.children) {
        debugContainer.append(element);
    }

    const clickTick = debugContainer.querySelector<HTMLInputElement>("[data-target='clickTick']");
    clickTick.addEventListener("change", function (ev) {
        if (!(ev.target instanceof HTMLInputElement))
            throw new Error("unknown click tick checkbox source");
        game.setup.clickTick = ev.target.checked;
    });
    createReactor(() => game.setup.clickTick).addHandler((v) => {
        clickTick.checked = v;
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

        const selector = simulationViewer.querySelector<HTMLInputElement>(
            "[data-target='simulationSelector']",
        );
        createReactor(() => movements).addHandler(() => {
            console.log("UPDATED MOVEMENTS");
            selector.max = (movements.length - 1).toString();
            selector.value = "0";
            calldraw();
        });

        game.simulator.addEvent("update-movements", function (m) {
            movements = m;
        });

        console.log("simulator is enabled");

        movements = game.simulator.movements;

        selector.addEventListener("input", function (ev) {
            if (!(ev.target instanceof HTMLInputElement))
                throw new Error("invalid selector element");
            selectedValue = ev.target.valueAsNumber;
            calldraw();
        });

        const upBtn = simulationViewer.querySelector("[data-target='sim-up']");
        upBtn.addEventListener("click", function () {
            selectedValue = selectedValue + 1;
            if (selectedValue > movements.length) selectedValue = movements.length;
            selector.value = selectedValue.toString();
            calldraw();
        });
        const downBtn = simulationViewer.querySelector("[data-target='sim-down']");
        downBtn.addEventListener("click", function () {
            selectedValue = selectedValue - 1;
            if (selectedValue < 0) selectedValue = 0;
            selector.value = selectedValue.toString();
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

    container.parentNode.insertBefore(debugContainer, container.nextSibling);
}
