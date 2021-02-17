import { getPositions } from "."
import { Brick } from "../../../../brick";
import { TetrisGame } from "../../../game"
import { predictableGameWithOneBlock } from "../../../setup"

/*global describe, expect, it*/
describe("getPositions", function () {

    const brickMatrixToString = function (matrix, trueMatch = true) {
        return matrix.map(x => x.map(y => y === trueMatch ? "X" : "0").join("")).join("\n");
    };

    const createArray = function (count, createValue) {
        var result = [];
        for (var i = 0; i < count; i++)
            result.push(createValue());
        return result;
    }

    const createMatrix = function (w, h) {
        return createArray(h, () => createArray(w, () => false));
    }

    it("can get expected positions", function () {
        const blocks = [[0, 1, 1], [1, 1, 0], [0, 0, 0]];
        var game = new TetrisGame(predictableGameWithOneBlock(blocks));
        game.init();
        const positions = getPositions(game.width, game.height, game.bricks, game.getMovingBrick());

        const lengthSequences = [8, 9, 8, 9];

        const differentPositions = lengthSequences.reduce((a, b) => a + b, 0);

        expect(positions.length).toBe(differentPositions);

        var startI = 0;
        var rotation = 0;
        for (var sequenceLength of lengthSequences) {
            var segment = positions.slice(startI, startI + sequenceLength);

            expect(segment.length).toBe(sequenceLength);

            for (var position of segment) {
                expect(position.rotation).toBe(rotation);

                const positionMatrixString = brickMatrixToString(position.brickMatrix);

                const expectedBrickBlocks = Brick.rotateBlocks(blocks, rotation);

                const expectedBlocks = createMatrix(game.width, game.height);

                for (var y = 0; y < expectedBrickBlocks.length; y++) {
                    for (var x = 0; x < expectedBrickBlocks[y].length; x++) {
                        const actualX = position.x + x;
                        const actualY = position.y + y;

                        const value = expectedBrickBlocks[y][x] === 1;

                        if (actualY < 0 || actualX < 0 || actualY > (game.height - 1) || actualX > (game.width - 1)) {
                            expect(value).toBe(false);
                            continue;
                        }
                        expect(expectedBlocks[actualY]).not.toBeUndefined("Was undefined at index " + actualY);
                        expect(expectedBlocks[actualY][actualX]).toBe(false);
                        expectedBlocks[actualY][actualX] = value;
                    }
                }

                let expectedBlocksString = brickMatrixToString(expectedBlocks, true);



                expect(positionMatrixString).toBe(expectedBlocksString);

            }

            startI += sequenceLength;
            rotation++;
        }
    })
})