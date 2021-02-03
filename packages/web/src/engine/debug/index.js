import DocumentUtil from "../../utils/document-util";
import * as htmlLoad from "./debug.html";
import { game } from "@tetris/core";
const { logic: { simulation: { attachSimulator } } } = game;

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

    var simulateCount = debugContainer.querySelector("[data-target='simulateCount']");
    var simulateButton = debugContainer.querySelector("[data-target='simulateButton']");

    var simulator = null;

    simulateButton.el.addEventListener("click", function () {
        if (simulator === null) {
            simulator = attachSimulator(game, false);
        }
        var count = simulateCount.el.value;
        for (var i = 0; i < count; i++) {
            simulator.tick();
        }
    });

    container.parentNode.insertBefore(debugContainer.el, container.nextSibling);
}