import TetrisGame from "./game.js";
import Color from "./color.js";

export function cloneGame(game) {
    var bricks = game.bricks.concat().map(b => b.clone());
    var clone = new TetrisGame(game.setup, { bricks });
    clone.brickforms = game.brickforms;
    return clone;
}

export function getBestMove(game) {
    var positions = [];

    var realMovingBrick = game.getMovingBrick();

    for (var x = realMovingBrick.mostLeft; x < realMovingBrick.mostRight; x++) {
        var clone = cloneGame(game);
        //console.log(clone.bricks);
        var movingBrick = clone.getMovingBrick();
        if (movingBrick == null)
            throw new Error("No moving brick");

        var oldX = movingBrick.innerX;

        while (movingBrick.innerX > x) {
            movingBrick.moveleft();
            if (movingBrick.innerX === oldX)
                throw new Error("brick is not moving");
            oldX = movingBrick.innerX;
        }

        while (movingBrick.innerX < x) {
            movingBrick.moveright();
            if (movingBrick.innerX === oldX)
                throw new Error("brick is not moving");
            oldX = movingBrick.innerX;
        }

        movingBrick.smashdown();

        var score = 0;

        var brickMatrix = clone.renderBrickMatrix();

        var str = brickMatrix.map(x => x.map(y => y ? "X" : "0").join("")).join("\n");

        console.debug(str);

        //console.debug(movingBrick.blocks.map(x => x.join("")).join("\r\n"));
        //console.debug(brickMatrix.map(x => x.map(x => x ? "1" : "0").join("")).join("\r\n"));

        positions.push({ x: movingBrick.x, y: movingBrick.y, brickMatrix });

        for (var _y = 0; _y < brickMatrix.length; _y++) {
            for (var _x = 0; _x < brickMatrix[_y].length; _x++) {
                if (brickMatrix[_y][_x] === true)
                    game.drawSingleBrick(_x, _y, Color.Black());
            }
        }

        game.drawBrick(movingBrick);
    }

    return positions;
}