import { getPositions } from ".";
import { Brick } from "../../../../brick/brick";
import { TetrisGame } from "../../../game";
import { convertNumbersToBooleans, predictableGameWithOneBlock } from "../../../setup";

describe("getPositions", function () {
    const brickMatrixToString = function (matrix, trueMatch = true) {
        return matrix.map((x) => x.map((y) => (y === trueMatch ? "X" : "0")).join("")).join("\n");
    };

    const createArray = function (count, createValue) {
        const result = [];
        for (let i = 0; i < count; i++) result.push(createValue());
        return result;
    };

    const createMatrix = function (w, h) {
        return createArray(h, () => createArray(w, () => false));
    };

    it("can get expected positions", function () {
        const blocks = convertNumbersToBooleans([
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ]);
        const game = new TetrisGame(predictableGameWithOneBlock(blocks));
        game.init();
        const positions = getPositions(game.width, game.height, game.bricks, game.getMovingBrick());

        const lengthSequences = [8, 9, 8, 9];

        const differentPositions = lengthSequences.reduce((a, b) => a + b, 0);

        expect(positions.length).toBe(differentPositions);

        let startI = 0;
        let rotation = 0;
        for (const sequenceLength of lengthSequences) {
            const segment = positions.slice(startI, startI + sequenceLength);

            expect(segment.length).toBe(sequenceLength);

            for (const position of segment) {
                expect(position.rotation).toBe(rotation);

                const positionMatrixString = brickMatrixToString(position.brickMatrix);

                const expectedBrickBlocks = Brick.rotateBlocks(blocks, rotation);

                const expectedBlocks = createMatrix(game.width, game.height);

                for (let y = 0; y < expectedBrickBlocks.length; y++) {
                    for (let x = 0; x < expectedBrickBlocks[y].length; x++) {
                        const actualX = position.x + x;
                        const actualY = position.y + y;

                        const value = expectedBrickBlocks[y][x] === true;

                        if (
                            actualY < 0 ||
                            actualX < 0 ||
                            actualY > game.height - 1 ||
                            actualX > game.width - 1
                        ) {
                            expect(value).toBe(false);
                            continue;
                        }
                        expect(expectedBlocks[actualY]).not.toBeUndefined();
                        expect(expectedBlocks[actualY][actualX]).toBe(false);
                        expectedBlocks[actualY][actualX] = value;
                    }
                }

                const expectedBlocksString = brickMatrixToString(expectedBlocks, true);

                expect(positionMatrixString).toBe(expectedBlocksString);
            }

            startI += sequenceLength;
            rotation++;
        }
    });
});
