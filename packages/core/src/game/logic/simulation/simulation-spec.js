import { TetrisGame } from "../../game";
import { getPossibleMoves } from "./index";

describe("getPossibleMoves", function () {
    it("can get a best possible move", function () {
        var game = new TetrisGame({});
        var moves = getPossibleMoves(game, {
            brickforms: []
         });
        console.log(moves);
    });
});