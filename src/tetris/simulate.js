import TetrisGame from "./game.js";
import Color from "./color.js";

export function cloneGame(game) {
    var bricks = game.bricks.concat().map(b => b.clone());
    var clone = new TetrisGame(game.setup, { bricks });
    clone.brickforms = game.brickforms;
    return clone;
}

function arrangeBrick(clone, movingBrick, x, maxWidth) {
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
        console.error(movingBrick, x);
        throw e;
    }
}

export function getPossibleMoves(game) {
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

        for (var x = movingBrickBase.mostLeft; x <= movingBrickBase.mostRight; x++) {
            var clone = cloneGame(cloneBase);

            var movingBrick = clone.getMovingBrick();
            arrangeBrick(clone, movingBrick, x, maxWidth);

            movingBrick.y = movingBrick.getLowestPosition();

            var score = 0;

            var brickMatrix = clone.renderBrickMatrix();

            var str = brickMatrix.map(x => x.map(y => y ? "X" : "0").join("")).join("\n");

            //console.debug(str);

            //console.debug(movingBrick.blocks.map(x => x.join("")).join("\r\n"));
            //console.debug(brickMatrix.map(x => x.map(x => x ? "1" : "0").join("")).join("\r\n"));

            positions.push({ brick: movingBrick, x: movingBrick.x, y: movingBrick.y, brickMatrix, rotation: movingBrick.rotation });

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
            var xHeight = 0;
            for (var y = matrix.length - 1; y >= 0; y--) {
                if (matrix[y][x] === true && countingHoles != true) {
                    countingHoles = true;
                }

                if (countingHoles === true && matrix[y][x] !== true && matrix.map(z => z[x]).slice(0, y).filter(f => f).length > 0) {
                    holes++;
                }

                if (matrix[y][x] === true) {
                    var currentHeight = matrix.length - y
                    if (xHeight < currentHeight)
                        xHeight = currentHeight;
                }
            }
            height += xHeight;
        }

        setup.scores = {
            holes,
            height,
        };

        setup.score = (0 - holes * 1) + (0 - height * 2);

    }
    positions = positions.sort((a, b) => {
        var diff = b.score - a.score;
        if (diff !== 0)
            return diff;
        return b.brick.y - a.brick.y;
    });
    console.log("POSITIONS", positions);
    console.log("movingBrick", movingBrick);
    console.log("got", positions.length, "should get", (movingBrickBase.mostRight - movingBrickBase.mostLeft) * 4)
    return positions;
}

class SimulatorRunner {
    #lastBrick;
    #movements = [];
    #game;
    constructor() {

    }

    attach(game) {
        this.#game = game;
    }

    drawMovements() {
        if (this.#movements.length > 0) {
            var brick = this.#movements[0].brick;
            console.log("drawing",brick);
            var color = new Color(255, 255, 255, 0.2);
            // var color = this.#lastBrick.color.invert().brightness(0.5);;
            setTimeout(() => this.#game.drawBrick(brick,color),50);
        }
    }

    start() {
        var runner = this;
        if (this.#game.setup.clickTick === true) {
            this.#game.ghostDrawing = false;
            this.#game.addEvent("tick", function () {
                runner.tick();
                runner.drawMovements();
            })
        }else {
            const ticker = () => {
                runner.tick();
                setTimeout(ticker, runner.getTimeout());
            };
            setTimeout(ticker, 0);
        }
    }

    getTimeout() {
        return 100 + (Math.random() * 150);
    }

    tick() {
        if (this.#game.getRUNNING() !== true)
            return;
        var currentMovingBrick = this.#game.getMovingBrick();
        if (this.#movements.length === 0 || this.#lastBrick != currentMovingBrick) {
            console.log("new brick", this.#movements.length === 0, this.#lastBrick != currentMovingBrick);
            this.#movements = getPossibleMoves(this.#game);
            this.#lastBrick = currentMovingBrick;
        }
        this.#game.moveTowards(this.#movements[0].x, this.#movements[0].rotation);
        console.log("move", this.#movements[0].x);
    }
}

export function attachSimulator(game) {
    var ticker = new SimulatorRunner();
    ticker.attach(game);
    ticker.start();
}