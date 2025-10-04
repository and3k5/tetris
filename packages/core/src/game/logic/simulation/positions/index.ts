import { Brick } from "../../../../brick"
import { TetrisGame } from "../../../game";
import { SimpleMovement } from "../movement";

/**
 * 
 * @param {number} width 
 * @param {number} height 
 * @param {Brick[]} bricks 
 * @param {Brick} currentBrick 
 * @returns {import("../movement").Movement[]}
 */
export function getPositions(width, height, bricks, currentBrick) {
    var positions = [];

    const movingBrick = currentBrick;

    for (var i = 0; i < 4; i++) {
        let rotatedBlocks = Brick.rotateBlocks(movingBrick.blocks, i);

        var mostLeft = Brick.calcMostLeft(rotatedBlocks);
        var mostRight = Brick.calcMostRight(width, rotatedBlocks);

        for (var x = mostLeft; x <= mostRight; x++) {
            var lowestY = Brick.calcLowestPosition(rotatedBlocks, x - movingBrick.x, height, bricks, movingBrick.x, movingBrick.y, movingBrick.guid);

            var brickMatrix = TetrisGame.renderBrickMatrix(width, height, bricks, [
                { guid: movingBrick.guid, x: x, y: lowestY, blocks: rotatedBlocks },
            ]);

            positions.push(new SimpleMovement({ brickMatrix, x, y: lowestY, rotation: i }));
        }
    }

    return positions;
}
