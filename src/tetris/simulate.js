import TetrisGame from "./game.js";

export function cloneGame(game) {
    var bricks = game.bricks.concat().map(b => b.clone());
    var clone = new TetrisGame(game.setup, { bricks });
    clone.brickforms = game.brickforms;
    return clone;
}

export function getBestMove(game) {
    var positions = [];

    for (var x = 0; x < game.WIDTH; x++) {
        var clone = cloneGame(game);
        //console.log(clone.bricks);
        var movingBrick = clone.getMovingBrick();
        if (movingBrick == null)
            throw new Error("No moving brick");

        var oldX = movingBrick.x;

        while (movingBrick.x > x) {
            movingBrick.moveleft();
            if (movingBrick.x === oldX)
                throw new Error("brick is not moving");
            oldX = movingBrick.x;
        }

        while (movingBrick.x < x) {
            movingBrick.moveright();
            if (movingBrick.x === oldX)
                throw new Error("brick is not moving");
            oldX = movingBrick.x;
        }

        //movingBrick.smashdown();

        var score = 0;

        var brickMatrix = clone.renderBrickMatrix();

        var str = brickMatrix.map(x => x.map(y => y ? "X" : "0").join("")).join("\n");

        console.log(str);

        positions.push({ x: movingBrick.x, y: movingBrick.y, brickMatrix });
    }

    return positions;
}