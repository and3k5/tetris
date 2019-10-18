import Brick from "../tetris/brick.js";
import TetrisGame from "../tetris/game.js";
import { defaultGame, TetrisSetup } from "../tetris/game-setup.js";
import * as console from "../utils/trace.js";

var setup = defaultGame();

describe("brick", () => {

    for (var brickform of setup.brickforms) {
        var i = setup.brickforms.indexOf(brickform);

        for (var j = 0; j < 4; j++) {
            it(`has a proper moveLeft property on brickform ${i} when rotated ${j} times`, function () {
                var i = this.i;
                var setup = this.setup;
                var brickform = this.brickform;

                var testGame = new TetrisGame(setup);
                testGame.nextRandom = i;

                var brick = new Brick({ game: testGame, brickform: brickform, x: 3, y: 0 });
                brick.moving = true;

                for (var k = 0; k < j; k++)
                    brick.rotate();

                testGame.bricks.push(brick);

                while (brick.canMoveLeft())
                    brick.moveleft();

                expect(brick.x).toEqual(brick.mostLeft);
                console.log(brick.x, brick.mostLeft);
            }.bind({ i, setup, brickform }))

            it(`has a proper moveRight property on brickform ${i} when rotated ${j} times`, function () {
                var i = this.i;
                var setup = this.setup;
                var brickform = this.brickform;

                var testGame = new TetrisGame(setup);
                testGame.nextRandom = i;

                var brick = new Brick({ game: testGame, brickform: brickform, x: 3, y: 0 });
                brick.moving = true;

                for (var k = 0; k < j; k++)
                    brick.rotate();

                testGame.bricks.push(brick);

                while (brick.canMoveRight())
                    brick.moveright();

                expect(brick.x).toEqual(brick.mostRight);
                console.log(brick.x, brick.mostRight);
            }.bind({ i, setup, brickform }))


        }

    }
    it("has a proper moveLeft property")

});