import { Brick } from "./brick";
import { utils } from "../";
import { convertNumbersToBooleans, defaultGame } from "../game/setup";
import { TetrisGame } from "../game";

const { trace: console } = utils;

const setup = defaultGame();

describe("brick", () => {
    it("returns false when collision is detected", function () {
        const brickA = new Brick({
            brickform: convertNumbersToBooleans([
                [1, 1],
                [1, 1],
            ]),
            x: 1,
            y: 10,
        });
        const brickB = new Brick({
            brickform: convertNumbersToBooleans([
                [1, 1],
                [1, 1],
            ]),
            x: 2,
            y: 10,
        });
        const result = brickA.willCollide(0, 0, [brickB]);
        expect(result).toEqual(true);
    });

    for (const brickform of setup.brickforms) {
        const i = setup.brickforms.indexOf(brickform);

        for (let j = 0; j < 4; j++) {
            it(
                `has a proper moveLeft property on brickform ${i} when rotated ${j} times`,
                function () {
                    const i = this.i;
                    const setup = this.setup;
                    const brickform = this.brickform;

                    const testGame = new TetrisGame(setup);
                    testGame.nextRandom = i;

                    const brick = new Brick({ game: testGame, brickform: brickform, x: 3, y: 0 });
                    brick.moving = true;

                    for (let k = 0; k < j; k++) brick.rotate();

                    testGame.bricks.push(brick);

                    while (brick.canMoveLeft()) brick.moveleft();

                    expect(brick.x).toEqual(brick.mostLeft);
                    console.debug(brick.x, brick.mostLeft);
                }.bind({ i, setup, brickform }),
            );

            it(
                `has a proper moveRight property on brickform ${i} when rotated ${j} times`,
                function () {
                    const i = this.i;
                    const setup = this.setup;
                    const brickform = this.brickform;

                    const testGame = new TetrisGame(setup);
                    testGame.nextRandom = i;

                    const brick = new Brick({ game: testGame, brickform: brickform, x: 3, y: 0 });
                    brick.moving = true;

                    for (let k = 0; k < j; k++) brick.rotate();

                    testGame.bricks.push(brick);

                    while (brick.canMoveRight()) brick.moveright();

                    expect(brick.x).toEqual(brick.mostRight);
                    console.debug(brick.x, brick.mostRight);
                }.bind({ i, setup, brickform }),
            );
        }
    }
});
