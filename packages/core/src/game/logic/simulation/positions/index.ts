import { Brick } from "../../../../brick";
import { TetrisGame } from "../../../game";
import { SimpleMovement } from "../movement";

export function getPositions(
    width: number,
    height: number,
    bricks: Brick[],
    currentBrick: Brick,
): SimpleMovement[] {
    const positions = [];

    const movingBrick = currentBrick;

    for (let i = 0; i < 4; i++) {
        const rotatedBlocks = Brick.rotateBlocks(movingBrick.blocks, i);

        const mostLeft = Brick.calcMostLeft(rotatedBlocks);
        const mostRight = Brick.calcMostRight(width, rotatedBlocks);

        for (let x = mostLeft; x <= mostRight; x++) {
            const lowestY = Brick.calcLowestPosition(
                rotatedBlocks,
                x - movingBrick.x,
                height,
                bricks,
                movingBrick.x,
                movingBrick.y,
                movingBrick.guid,
            );

            const brickMatrix = TetrisGame.renderBrickMatrix(width, height, bricks, [
                { guid: movingBrick.guid, x: x, y: lowestY, blocks: rotatedBlocks },
            ]);

            positions.push(new SimpleMovement({ brickMatrix, x, y: lowestY, rotation: i }));
        }
    }

    return positions;
}
