import DocumentUtil from "./document-util.js";
import * as htmlLoad from "./debug.html";
import { attachSimulator } from "./simulate.js";

export function initDebug(parent, container, game) {
    var debugContainer = new DocumentUtil(container);

    var element = DocumentUtil.stringToElement(htmlLoad);
    debugContainer.append(element);

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