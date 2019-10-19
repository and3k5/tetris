import TetrisGame from "./game.js";
import Color from "./color.js";
import * as console from "../utils/trace.js";

export function cloneGame(game) {
    var bricks = game.bricks.concat().map(b => b.clone());

    var extra = { bricks };

    if (game.HOLDING != null)
        extra.holding = game.HOLDING.clone();

    var clone = new TetrisGame(game.setup, extra);
    clone.brickforms = game.brickforms;
    clone.HOLDINGCOUNT = game.HOLDINGCOUNT;
    return clone;
}

function arrangeBrick(clone, movingBrick, x, maxWidth) {
    if (movingBrick == null)
        throw new Error("No moving brick");

    try {
        //var oldX = movingBrick.innerX;
        //console.debug(movingBrick.blocks);
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

function getPositions(game, usesHolding = false) {
    var maxWidth = game.WIDTH * 2;

    var positions = [];

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

            var brickMatrix = clone.renderBrickMatrix();
            positions.push(
                {
                    brick: movingBrick,
                    x: movingBrick.x,
                    y: movingBrick.y,
                    brickMatrix,
                    rotation: movingBrick.rotation,
                    needsHolding: usesHolding,
                }
            );
        }
    }

    return positions;
}

export function getPossibleMoves(game) {
    var positions = [];

    for (var pos of getPositions(game))
        positions.push(pos);

    if (game.canUseHolding) {
        var clone = cloneGame(game);
        clone.holdingShift();

        for (var pos of getPositions(clone, true))
            positions.push(pos);
    }

    for (var setup of positions) {
        //console.debug(setup);
        var matrix = setup.brickMatrix;
        setup.score = 0;

        var holes = 0;
        var height = 0;
        var clearingLines = 0;

        for (var y = matrix.length - 1; y >= 0; y--) {
            if (matrix[y].filter(x => x !== true).length === 0) {
                clearingLines++;
            }
        }

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
            clearingLines,
        };

        setup.score = (clearingLines * 3) + (0 - holes * 0.25) + (0 - height * 2);

    }
    positions = positions.sort((a, b) => {
        var diff = b.score - a.score;
        if (diff !== 0)
            return diff;
        return b.brick.y - a.brick.y;
    });
    console.debug("POSITIONS", positions);
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
            console.debug("drawing", brick);
            var color = new Color(255, 255, 255, 0.2);
            // var color = this.#lastBrick.color.invert().brightness(0.5);;
            setTimeout(() => this.#game.drawBrick(brick, color), 50);
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
        return 100;
    }

    tick() {
        if (this.#game.getRUNNING() !== true)
        return;
        var currentMovingBrick = this.#game.getMovingBrick();
        if (this.#movements.length === 0 || this.#lastBrick != currentMovingBrick) {
            console.debug("new brick", this.#movements.length === 0, this.#lastBrick != currentMovingBrick);
            this.#movements = getPossibleMoves(this.#game);
            this.#lastBrick = currentMovingBrick;
        }
        console.log(this.#movements[0].score);
        if (this.#movements[0].needsHolding === true) {
            this.#game.holdingShift();
            this.#movements[0].needsHolding = false;
        }else {
            this.#game.moveTowards(this.#movements[0].x, this.#movements[0].rotation);
        }

        console.debug("move", this.#movements[0].x);
    }
}

export function attachSimulator(game) {
    var ticker = new SimulatorRunner();
    ticker.attach(game);
    ticker.start();
}