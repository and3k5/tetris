import { TetrisGame } from "../../game";
import { EventController } from "../../../extensions/event";
import { StaticNextBrick } from "../next-brick";
import { getPositions } from "./positions";
import { getScore, sortMovements } from "./simulate-rating";
import { Brick } from "../../../brick/brick";
import { Color } from "../../../utils/color";

export function cloneGame(game, setupChanges) {
    const bricks = game.bricks.concat().map((b) => b.clone());

    const extra: { bricks: Brick[]; holding?: Brick | undefined } = { bricks };

    if (game.HOLDING != null) extra.holding = game.HOLDING.clone();

    const setup = Object.assign({}, game.setup, setupChanges, {
        brickforms: game.setup.brickforms,
        width: game.setup.width,
        height: game.setup.height,
        sequence: game.setup.sequence,
    });

    const clone = new TetrisGame(setup, extra);
    clone.brickforms = game.brickforms;
    clone.HOLDINGCOUNT = game.HOLDINGCOUNT;
    return clone;
}

// function arrangeBrick(clone, movingBrick, x, maxWidth) {
//     if (movingBrick == null) throw new Error("No moving brick");

//     try {
//         //var oldX = movingBrick.innerX;
//         //console.debug(movingBrick.blocks);
//         let moveStep = 0;
//         while (movingBrick.x > x) {
//             if (!movingBrick.moveleft(true)) throw new Error("brick is not moving left");
//             if (moveStep++ > maxWidth) throw new Error("moving out of view");
//         }

//         moveStep = 0;
//         // oldX = movingBrick.innerX;

//         while (movingBrick.x < x) {
//             if (!movingBrick.moveright(true)) throw new Error("brick is not moving right");
//             if (moveStep++ > maxWidth) throw new Error("moving out of view");
//         }
//     } catch (e) {
//         console.error(movingBrick, x);
//         throw e;
//     }
// }

export function getPossibleMoves(game: TetrisGame, setupChanges?: unknown) {
    let positions = [];

    for (const pos of getPositions(game.width, game.height, game.bricks, game.getMovingBrick()))
        positions.push(pos);

    if (game.canUseHolding) {
        const clone = cloneGame(game, setupChanges);
        clone.holdingShift();

        for (const pos of getPositions(
            clone.width,
            clone.height,
            clone.bricks,
            clone.getMovingBrick(),
        )) {
            pos.needsHolding = true;
            positions.push(pos);
        }
    }

    for (const setup of positions) {
        setup.scores = getScore(setup.brickMatrix);
    }

    positions = sortMovements(positions);
    console.debug("POSITIONS", positions);
    return positions;
}

class SimulatorRunner {
    private _movements = [];
    private _game;
    private _cancelled = false;
    private _mode = "assist";
    private _simulation = [];
    private _starttime = 0;
    private _eventController = new EventController(this);
    constructor() {}

    attach(game) {
        this._game = game;
        this._game.addEvent("current-brick-change", () => {
            console.debug("current brick change");
            this.getNewMove();
        });
    }

    drawMovements() {
        if (this._movements.length > 0) {
            const brick = this._movements[0].brick;
            console.debug("drawing", brick);
            const color = new Color(255, 255, 255, 0.2);
            setTimeout(() => this._game.drawBrick(brick, color), 50);
        }
    }

    cancel() {
        this._cancelled = true;
    }

    get isCancelled() {
        return this._cancelled;
    }

    start() {
        this._starttime = new Date().getTime();
        if (this._game.setup.clickTick === true) {
            this._game.ghostDrawing = false;
            this._game.addEvent("tick", () => {
                if (this.isCancelled !== false) return;
                this.tick();
                this.drawMovements();
            });
        } else {
            const ticker = () => {
                if (this.isCancelled !== false) return;
                this.tick();
                setTimeout(ticker, this.getTimeout());
            };
            setTimeout(ticker, 0);
        }
        this._game.addEvent("lose", () => {
            this.cancel();
        });
    }

    getTimeout() {
        return 100;
    }

    setMode(mode) {
        this._mode = mode;
    }

    setSimulation(simulation) {
        this._simulation = JSON.parse(JSON.stringify(simulation));
    }

    tick() {
        if (this._game.running !== true) return;
        if (this._mode === "assist") this.assistTick();
        else if (this._mode === "playback") this.playbackTick();
        else throw new Error("Mode is not supported: " + this._mode);
    }

    getNewMove() {
        this._movements = getPossibleMoves(this._game, { nextBrick: new StaticNextBrick(0) });
        //console.log(this._movements[0]);
        this._eventController.trigger("update-movements", null, this._movements.concat());
    }

    addEvent(name, handler) {
        this._eventController.on(name, handler);
    }

    get targetMovement() {
        if (this._movements.length < 1) return undefined;
        return this._movements[0];
    }

    assistTick() {
        const movement = this.targetMovement;
        if (movement == null) return;

        const instruction = movement.getNextInstruction();
        if (typeof instruction === "undefined") {
            return; // skip
        } else if (typeof instruction === "function") {
            const response = instruction(this._game);
            if (response instanceof Promise) {
                console.warn("TODO: async handle / promise await missing");
            }
        } else {
            throw new Error("Unknown instruction type");
        }
    }

    playbackTick() {
        throw new Error("Not implemented");
    }

    get movements() {
        return this._movements;
    }
}

export function attachSimulator(game, start = true) {
    const ticker = new SimulatorRunner();
    ticker.attach(game);
    if (Array.isArray(game.setup.simulation)) {
        ticker.setMode("playback");
        ticker.setSimulation(game.setup.simulation);
    }
    if (start === true) ticker.start();
    return ticker;
}
