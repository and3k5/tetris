import DocumentUtil from "../../utils/document-util";
import * as htmlLoad from "./debug.html";
import { game } from "@tetris/core";
const { logic: { simulation: { attachSimulator } } } = game;

/**
 * 
 * @param {any} parent 
 * @param {any} container 
 * @param {import("../../../../core/src/game").TetrisGame} game 
 */
export function initDebug(parent, container, game) {
    var debugContainer = new DocumentUtil(container);

    var element = DocumentUtil.stringToElement(htmlLoad);
    debugContainer.append(element);

    var clickTick = debugContainer.querySelector("[data-target='clickTick']");
    clickTick.el.addEventListener("change", function (ev) {
        game.setup.clickTick = ev.target.checked;
    });
    clickTick.react(() => game.setup.clickTick).addHandler(v => {
        clickTick.el.checked = v
    });

    var simulationViewer = debugContainer.querySelector("[data-target='simulation-viewer']");


    if (game.simulator != null) {
        var selectedValue = -1;
        var movements = [];

        /**
         * @type {import("..").WebGraphicEngine}
         */
        const graphicsEngine = game.graphicsEngine;

        const calldraw = function () {
            console.log("draw: " + selectedValue);

            graphicsEngine.render(true, false);
            graphicsEngine.drawState([], graphicsEngine.gameCtx);

            if (selectedValue < 0) {
                console.log("TODO CLEAR");
            } else {
                var movement = movements[selectedValue]
                console.log("DRAW SIMULATION STEP");
            }
        }

        var selector = simulationViewer.querySelector("[data-target='simulationSelector']");
        selector.react(() => movements).addHandler(v => {
            console.log("UPDATED MOVEMENTS");
            selector.el.max = movements.length - 1;
            selector.el.value = 0;
            calldraw(null);
        });

        game.simulator.addEvent("update-movements", function (m) {
            movements = m;
        });

        console.log("simulator is enabled");


        movements = game.simulator.movements;

        selector.el.addEventListener("change", function (ev) {
            selectedValue = ev.target.value;
            calldraw();
        });

        var upBtn = simulationViewer.querySelector("[data-target='sim-up']");
        upBtn.el.addEventListener("click", function () {
            selectedValue = selectedValue + 1;
            if (selectedValue > movements.length)
                selectedValue = movements.length;
            selector.el.value = selectedValue;
            calldraw();
        });
        var downBtn = simulationViewer.querySelector("[data-target='sim-down']");
        downBtn.el.addEventListener("click", function () {
            selectedValue = selectedValue - 1;
            if (selectedValue < 0)
                selectedValue = 0;
            selector.el.value = selectedValue;
            calldraw();
        });
    } else {
        console.log("simulator is not enabled");
        simulationViewer.style.display = "none";
    }



    container.parentNode.insertBefore(debugContainer.el, container.nextSibling);
}