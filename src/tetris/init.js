import "core-js/stable";
import "regenerator-runtime/runtime";
import { defaultGame } from "./game-setup.js";
import TetrisGame from "./game.js";
import DocumentUtil from "./document-util.js";
import { getBestMove } from "./simulate.js";

export function init(container) {
    var tetrisgame;

    if (typeof (container) === "string") {
        container = window.document.body.querySelector(container);
    }

    container = new DocumentUtil(container);

    var holdingCanvas;
    var gameCanvas;
    var nextCanvas;
    var score;

    container.append(new DocumentUtil("div").attr("class", "tetris-logo"));
    container.append(new DocumentUtil("p").attr("class", "scorelbl").text("Score: ").append(score = new DocumentUtil("span").attr("id", "score").text("0").el));
    container.append(
        new DocumentUtil("span").attr("class", "holding")
            .append(
                new DocumentUtil("p")
                    .text("Hold:")
            )
            .append(
                holdingCanvas = new DocumentUtil("canvas")
                    .attr("id", "holding")
                    .el,
            )
    );

    container.append(gameCanvas = new DocumentUtil("canvas").attr("id", "game").el);

    container.append(
        new DocumentUtil("span").attr("class", "next")
            .append(
                new DocumentUtil("p")
                    .text("Next:")
            )
            .append(
                nextCanvas = new DocumentUtil("canvas")
                    .attr("id", "next")
                    .el,
            )
    );

    tetrisgame = new TetrisGame(defaultGame());
    tetrisgame.init(
        gameCanvas,
        holdingCanvas,
        nextCanvas,
        score
    );

    var url = new URL(location.href);
    if (url.searchParams.get("simulate") === "1")
        (function () {
            var lastBrick;
            var movement;
            setInterval(function () {
                if (movement == null || lastBrick != tetrisgame.getMovingBrick()) {
                    console.log("new brick");
                    movement = getBestMove(tetrisgame, () => lastBrick, (v) => lastBrick = v);
                    lastBrick = tetrisgame.getMovingBrick();
                }
                tetrisgame.moveTowards(movement.x);
                console.log("move",movement.x);

            }, 100)
        })();


    return tetrisgame;
}