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
    const positions = [];

    const movingBrick = currentBrick;

    for (let i = 0; i < 4; i++) {
        const rotatedBlocks = Brick.rotateBlocks(movingBrick.blocks, i);

        const mostLeft = Brick.calcMostLeft(rotatedBlocks);
        const mostRight = Brick.calcMostRight(width, rotatedBlocks);

        for (let x = mostLeft; x <= mostRight; x++) {
            const lowestY = Brick.calcLowestPosition(rotatedBlocks, x - movingBrick.x, height, bricks, movingBrick.x, movingBrick.y, movingBrick.guid);

            const brickMatrix = TetrisGame.renderBrickMatrix(width, height, bricks, [
                { guid: movingBrick.guid, x: x, y: lowestY, blocks: rotatedBlocks },
            ]);

            positions.push(new SimpleMovement({ brickMatrix, x, y: lowestY, rotation: i }));
        }
    }

    return positions;
}
