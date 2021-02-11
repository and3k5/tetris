import { Brick } from "../../../../brick"

export function getPositions(game, usesHolding = false, setupChanges = {}) {
    var positions = [];

    var movingBrick = game.getMovingBrick();

    for (var i = 0; i < 4; i++) {
        let rotatedBlocks = Brick.rotateBlocks(movingBrick.blocks, i);

        var mostLeft = Brick.calcMostLeft(rotatedBlocks);
        var mostRight = Brick.calcMostRight(game, rotatedBlocks);

        for (var x = mostLeft; x <= mostRight; x++) {
            //var clone = cloneGame(cloneBase,setupChanges);

            //var movingBrick = clone.getMovingBrick();
            // try {
            //     //arrangeBrick(clone, movingBrick, x, maxWidth);
            // }
            // catch (e) {
            //     e.message += " (skipped)";
            //     console.error(e);
            //     window.location.reload();
            //     continue;
            //     // TODO game locks down, even if skipped
            // }

            //var movingBrick = game.getMovingBrick();

            // movingBrick.y = movingBrick.getLowestPosition(x - movingBrick.x);
            var lowestY = Brick.calcLowestPosition(rotatedBlocks, x - movingBrick.x, game, movingBrick.x, movingBrick.y, movingBrick.guid);

            var brickMatrix = game.renderBrickMatrix(
                [
                    { guid: movingBrick.guid, x: x, y: lowestY, blocks: rotatedBlocks },
                ]
            );
            positions.push(
                {
                    //brick: movingBrick,
                    x: x,
                    y: lowestY,
                    brickMatrix,
                    rotation: i,
                    needsHolding: usesHolding,
                }
            );
        }
    }

    return positions;
}
