import { TetrisGame } from "../../";
import { Brick } from "../../../brick"
import { EventController } from "../../../extensions/event";
import { trace as console, color } from "../../../utils";
const { Color } = color;
import { StaticNextBrick } from "../next-brick";
import { getScores, sortMovements } from "./simulate-rating";

export function cloneGame(game, setupChanges) {
    var bricks = game.bricks.concat().map(b => b.clone());

    var extra = { bricks };

    if (game.HOLDING != null)
        extra.holding = game.HOLDING.clone();

    var setup = Object.assign({}, game.setup, setupChanges, {
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

function getPositions(game, usesHolding = false, setupChanges = {}) {
    var maxWidth = game.width * 2;

    var positions = [];

    var movingBrick = game.getMovingBrick();

    for (var i = 0; i < 4; i++) {
        let rotatedBlocks = movingBrick.blocks;
        for (var r = 0; r < i; r++)
            rotatedBlocks = Brick.calcRotatedBlocks(movingBrick.blocks);

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

export function getPossibleMoves(game, setupChanges) {
    var positions = [];

    for (var pos of getPositions(game, false, setupChanges))
        positions.push(pos);

    if (game.canUseHolding) {
        var clone = cloneGame(game, setupChanges);
        clone.holdingShift();

        for (var pos of getPositions(clone, true, setupChanges))
            positions.push(pos);
    }

    for (var setup of positions) {
        //console.debug(setup);
        var matrix = setup.brickMatrix;
        //setup.score = 0;

        setup.scores = getScores(game, matrix);
        //setup.score = summaryScore(setup.scores);
    }

    positions = sortMovements(positions);
    console.debug("POSITIONS", positions);
    return positions;
}

class SimulatorRunner {
    #movements = [];
    #game;
    #cancelled = false;
    #mode = "assist";
    #simulation = [];
    #starttime = 0;
    #eventController = new EventController(this);
    constructor() {

    }

    attach(game) {
        this.#game = game;
        var simulator = this;
        this.#game.addEvent("current-brick-change", function () {
            console.log("current brick change");
            simulator.getNewMove();
        });
    }

    drawMovements() {
        if (this.#movements.length > 0) {
            var brick = this.#movements[0].brick;
            console.debug("drawing", brick);
            var color = new Color(255, 255, 255, 0.2);
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
        } else {
            const ticker = () => {
                if (runner.isCancelled !== false)
                    return;
                runner.tick();
                setTimeout(ticker, runner.getTimeout());
            };
            setTimeout(ticker, 0);
        }
        this.#game.addEvent("lose", function () {
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

    getNewMove() {
        this.#movements = getPossibleMoves(this.#game, { nextBrick: new StaticNextBrick(0) });
        console.log(this.#movements[0]);
        this.#eventController.trigger("update-movements", null, this.#movements.concat());
    }

    addEvent(name, handler) {
        this.#eventController.on(name, handler);
    }

    assistTick() {
        if (this.#movements.length < 1)
            return;
        console.debug(this.#movements[0].score);
        if (this.#movements[0].needsHolding === true) {
            this.#game.holdingShift();
            this.#movements[0].needsHolding = false;
        } else {
            this.#game.moveTowards(this.#movements[0].x, this.#movements[0].rotation);
        }

        console.debug("move", this.#movements[0].x);
    }

    playbackTick() {
        throw new Error("Not implemented");
        var time = new Date().getTime() - this.#starttime;
        var simulations = this.#simulation.filter(s => s.done !== true && s.time < time);
        console.log(simulations);
        for (var simulation of simulations) {
            if (simulation.type === "nextRandom") {
                this.#game.nextRandom = simulation.val;
            } else if (simulation.type === "smashdown") {
                this.#game.action_smashdown();
            }
            this.#game.PENDINGUPDATE = true;
            simulation.done = true;
        }
    }

    get movements() {
        return this.#movements;
    }
}

export function attachSimulator(game, start = true) {
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