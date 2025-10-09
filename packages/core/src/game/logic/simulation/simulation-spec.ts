import { TetrisGame } from "../../game";
import { defaultGame } from "../../setup";
import { getPossibleMoves } from "./";

describe("getPossibleMoves", function () {
    it("can get a best possible move", function () {
        const setup = defaultGame();
        const game = new TetrisGame(setup);
        game.init();
        const moves = getPossibleMoves(game, {});
        //console.log(moves);
    });
});
