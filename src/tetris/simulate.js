import TetrisGame from "./game.js";
import Color from "./color.js";

export function cloneGame(game) {
    var bricks = game.bricks.concat().map(b => b.clone());
    var clone = new TetrisGame(game.setup, { bricks });
    clone.brickforms = game.brickforms;
    return clone;
}

function arrangeBrick(clone,movingBrick,x, maxWidth) {
    if (movingBrick == null)
        throw new Error("No moving brick");

    try {
        //var oldX = movingBrick.innerX;
        //console.log(movingBrick.blocks);
        var moveStep = 0;
        while (movingBrick.x > x) {
            if (!movingBrick.moveleft(true))
                throw new Error("brick is not moving left");
            if (moveStep++ > maxWidth)
                throw new Error("moving out of view");
        }

        moveStep = 0;
        // oldX = movingBrick.innerX;

        while (movingBrick.x < x) {
            if (!movingBrick.moveright(true))
                throw new Error("brick is not moving right");
            if (moveStep++ > maxWidth)
                throw new Error("moving out of view");
        }
    }
    catch (e) {
        console.error(movingBrick,x);
        throw e;
    }
}

export function getBestMove(game, get, set) {
    var positions = [];

    var realMovingBrick = game.getMovingBrick();
    var maxWidth = game.WIDTH * 2;

    for (var i = 0; i < 4; i++) {
        var cloneBase = cloneGame(game);
        var movingBrickBase = cloneBase.getMovingBrick();

        var oldRotation = movingBrickBase.rotation;
        while (movingBrickBase.rotation != i) {
            movingBrickBase.rotate();
            if (oldRotation === movingBrickBase.rotation)
                throw new Error("not rotating");
        }

        for (var x = movingBrickBase.mostLeft; x < movingBrickBase.mostRight; x++) {
            var clone = cloneGame(cloneBase);
            
            var movingBrick = clone.getMovingBrick();
            arrangeBrick(clone,movingBrick,x, maxWidth);

            movingBrick.y = movingBrick.getLowestPosition();

            var score = 0;

            var brickMatrix = clone.renderBrickMatrix();

            var str = brickMatrix.map(x => x.map(y => y ? "X" : "0").join("")).join("\n");

            //console.debug(str);

            //console.debug(movingBrick.blocks.map(x => x.join("")).join("\r\n"));
            //console.debug(brickMatrix.map(x => x.map(x => x ? "1" : "0").join("")).join("\r\n"));

            positions.push({ x: movingBrick.x, y: movingBrick.y, brickMatrix, rotation: movingBrick.rotation });

            // for (var _y = 0; _y < brickMatrix.length; _y++) {
            //     for (var _x = 0; _x < brickMatrix[_y].length; _x++) {
            //         if (brickMatrix[_y][_x] === true)
            //             game.drawSingleBrick(_x, _y, Color.Black());
            //     }
            // }

            //game.drawBrick(movingBrick);
        }
    }

    for (var setup of positions) {
        //console.log(setup);
        var matrix = setup.brickMatrix;
        setup.score = 0;

        var holes = 0;
        var height = 0;

        for (var x = 0; x < game.WIDTH; x++) {
            var countingHoles = false;

            for (var y = matrix.length - 1; y >= 0; y--) {
                if (matrix[y][x] === true && countingHoles != true) {
                    countingHoles = true;
                }

                if (countingHoles === true && matrix[y][x] !== true && matrix.map(z => z[x]).slice(0, y).filter(f => f).length > 0) {
                    holes++;
                }

                if (matrix[y][x] === true) {
                    var currentHeight = matrix.length - y
                    if (height < currentHeight)
                        height = currentHeight;
                }
            }
        }

        setup.scores = {
            holes,
            height,
        };

        setup.score = (0 - holes * 1) + (0 - height * 2);

    }
    positions = positions.sort((a, b) => b.score - a.score);
    console.log("POSITIONS", positions);
    console.log("movingBrick", movingBrick);
    console.log("got",positions.length,"should get",(movingBrickBase.mostRight - movingBrickBase.mostLeft)*4)
    return positions[0];
}

export function attachSimulator(game) {
    var lastBrick;
    var movement;

    game.addEvent("tick", function () {
        var currentMovingBrick = game.getMovingBrick();
        if (movement == null || lastBrick != currentMovingBrick) {
            console.log("new brick", movement == null, lastBrick != currentMovingBrick);
            movement = getBestMove(game, () => lastBrick, (v) => lastBrick = v);
            lastBrick = currentMovingBrick;
        }
        game.moveTowards(movement.x, movement.rotation);
        console.log("move", movement.x);
    });
}