/*global describe, it*/
import { TetrisGame } from "../../game";
import { defaultGame } from "../../setup";
import { getPossibleMoves } from "./";

describe("getPossibleMoves", function () {
    it("can get a best possible move", function () {
        var setup = new defaultGame();
        var game = new TetrisGame(setup);
        game.init();
        var moves = getPossibleMoves(game, {

        });
        console.log(moves);
    });
});
