import { Brick } from "./brick";
import { game, utils } from "../";
const { TetrisGame, setup: { defaultGame, TetrisSetup } } = game;
const { trace: console } = utils;

var setup = defaultGame();

describe("brick", () => {

    it("returns false when collision is detected", function () {
        var brickA = new Brick({ brickform: [[1, 1], [1, 1]], x: 1, y: 10 });
        var brickB = new Brick({ brickform: [[1, 1], [1, 1]], x: 2, y: 10 });
        var result = brickA.willCollide(0, 0, [brickB]);
        expect(result).toEqual(true);
    });

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
                console.debug(brick.x, brick.mostLeft);
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
                console.debug(brick.x, brick.mostRight);
            }.bind({ i, setup, brickform }))


        }

    }

});