import TetrisGame from "./game.js";
import Color from "./color.js";
import * as console from "../utils/trace.js";
import { StaticNextBrick } from "./logic/next-brick.js";

export function cloneGame(game,setupChanges) {
    var bricks = game.bricks.concat().map(b => b.clone());

    var extra = { bricks };

    if (game.HOLDING != null)
        extra.holding = game.HOLDING.clone();

    var setup = Object.assign({},game.setup, setupChanges,{
        brickforms: game.setup.brickforms,
        width: game.setup.width,
        height: game.setup.height,
        sequence: game.setup.sequence
    });

    var clone = new TetrisGame(setup, extra);
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

function getPositions(game, usesHolding = false,setupChanges = {}) {
    var maxWidth = game.width * 2;

    var positions = [];

    for (var i = 0; i < 4; i++) {
        var cloneBase = cloneGame(game,setupChanges);
        var movingBrickBase = cloneBase.getMovingBrick();

        var oldRotation = movingBrickBase.rotation;
        while (movingBrickBase.rotation != i) {
            movingBrickBase.rotate();
            if (oldRotation === movingBrickBase.rotation)
                throw new Error("not rotating");
        }

        for (var x = movingBrickBase.mostLeft; x <= movingBrickBase.mostRight; x++) {
            var clone = cloneGame(cloneBase,setupChanges);

            var movingBrick = clone.getMovingBrick();
            try {
                arrangeBrick(clone, movingBrick, x, maxWidth);
            }
            catch (e) {
                e.message += " (skipped)";
                console.error(e);
                window.location.reload();
                continue;
                // TODO game locks down, even if skipped
            }

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

export function getPossibleMoves(game,setupChanges) {
    var positions = [];

    for (var pos of getPositions(game,false,setupChanges))
        positions.push(pos);

    if (game.canUseHolding) {
        var clone = cloneGame(game,setupChanges);
        clone.holdingShift();

        for (var pos of getPositions(clone, true, setupChanges))
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

        for (var x = 0; x < game.width; x++) {
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
    positions = sortMovements(positions);
    console.debug("POSITIONS", positions);
    return positions;
}

export function sortMovements(positions) {
    return positions.concat().sort((a, b) => {
        var diff = b.score - a.score;
        if (diff !== 0)
            return diff;
        return b.brick.y - a.brick.y;
    });
}

class SimulatorRunner {
    #lastBrick;
    #movements = [];
    #game;
    #cancelled = false;
    #mode = "assist";
    #simulation = [];
    #starttime = 0;
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

    cancel() {
        this.#cancelled = true;
    }

    get isCancelled() {
        return this.#cancelled;
    }

    start() {
        var runner = this;
        this.#starttime = new Date().getTime();
        if (this.#game.setup.clickTick === true) {
            this.#game.ghostDrawing = false;
            this.#game.addEvent("tick", function () {
                if (runner.isCancelled !== false)
                    return;
                runner.tick();
                runner.drawMovements();
            })
        }else {
            const ticker = () => {
                if (runner.isCancelled !== false)
                    return;
                runner.tick();
                setTimeout(ticker, runner.getTimeout());
            };
            setTimeout(ticker, 0);
        }
        this.#game.addEvent("lose",function () {
            runner.cancel();
        });
    }

    getTimeout() {
        return 100;
    }

    setMode(mode) {
        this.#mode = mode;
    }

    setSimulation(simulation) {
        this.#simulation = JSON.parse(JSON.stringify(simulation));
    }

    tick() {
        if (this.#game.running !== true)
            return;
        if (this.#mode === "assist")
            this.assistTick();
        else if (this.#mode === "playback")
            this.playbackTick();
        else
            throw new Error("Mode is not supported: " + this.#mode);
    }

    assistTick() {
        var currentMovingBrick = this.#game.getMovingBrick();
        if (this.#movements.length === 0 || this.#lastBrick != currentMovingBrick) {
            console.debug("new brick", this.#movements.length === 0, this.#lastBrick != currentMovingBrick);
            this.#movements = getPossibleMoves(this.#game,{nextBrick: new StaticNextBrick(0)});
            this.#lastBrick = currentMovingBrick;
        }
        console.debug(this.#movements[0].score);
        if (this.#movements[0].needsHolding === true) {
            this.#game.holdingShift();
            this.#movements[0].needsHolding = false;
        }else {
            this.#game.moveTowards(this.#movements[0].x, this.#movements[0].rotation);
        }

        console.debug("move", this.#movements[0].x);
    }

    playbackTick() {
        var time = new Date().getTime() - this.#starttime;
        var simulations = this.#simulation.filter(s => s.done !== true && s.time < time);
        console.log(simulations);
        for (var simulation of simulations) {
            if (simulation.type === "nextRandom") {
                this.#game.nextRandom = simulation.val;
            }else if (simulation.type === "smashdown") {
                this.#game.action_smashdown();
            }
            this.#game.PENDINGUPDATE = true;
            simulation.done = true;
        }
    }
}

export function attachSimulator(game,start = true) {
    var ticker = new SimulatorRunner();
    ticker.attach(game);
    if (Array.isArray(game.setup.simulation)) {
        ticker.setMode("playback");
        ticker.setSimulation(game.setup.simulation);
    }
    if (start === true)
        ticker.start();
    return ticker;
}