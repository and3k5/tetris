import { TetrisGame } from "../../";
import { EventController } from "../../../extensions/event";
import { trace as console, color } from "../../../utils";
const { Color } = color;
import { StaticNextBrick } from "../next-brick";
import { getPositions } from "./positions";
import { getScore, sortMovements } from "./simulate-rating";

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

/**
 * 
 * @param {TetrisGame} game 
 * @param {*} setupChanges 
 */
export function getPossibleMoves(game, setupChanges) {
    var positions = [];

    for (let pos of getPositions(game.width, game.height, game.bricks, game.getMovingBrick()))
        positions.push(pos);

    if (game.canUseHolding) {
        var clone = cloneGame(game, setupChanges);
        clone.holdingShift();

        for (let pos of getPositions(clone.width, clone.height, clone.bricks, clone.getMovingBrick())) {
            pos.needsHolding = true;
            positions.push(pos);
        }
    }

    for (let setup of positions) {
        setup.scores = getScore(setup.brickMatrix);
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
            console.debug("current brick change");
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
        //console.log(this.#movements[0]);
        this.#eventController.trigger("update-movements", null, this.#movements.concat());
    }

    addEvent(name, handler) {
        this.#eventController.on(name, handler);
    }

    get targetMovement() {
        if (this.#movements.length < 1)
            return undefined;
        return this.#movements[0];
    }

    assistTick() {
        const movement = this.targetMovement;
        if (movement == null)
            return;

        const instruction = movement.getNextInstruction();
        if (typeof (instruction) === "undefined") {
            return; // skip
        }
        else if (typeof (instruction) === "function") {
            const response = instruction(this.#game);
            if (response instanceof Promise) {
                console.warn("TODO: async handle / promise await missing");
            }
        } else {
            throw new Error("Unknown instruction type");
        }
    }

    playbackTick() {
        throw new Error("Not implemented");
        // eslint-disable-next-line no-unreachable
        var time = new Date().getTime() - this.#starttime;
        var simulations = this.#simulation.filter(s => s.done !== true && s.time < time);
        console.log(simulations);
        for (var simulation of simulations) {
            if (simulation.type === "nextRandom") {
                this.#game.nextRandom = simulation.val;
            } else if (simulation.type === "smashdown") {
                this.#game.input.smashDown();
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