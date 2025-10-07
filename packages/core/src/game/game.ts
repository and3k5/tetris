import { Brick } from "../brick";
import * as gameController from "./game-controller.js";
import { simulation } from "./logic";
const { attachSimulator } = simulation;
import { trace as console, color } from "../utils";
const { Color } = color;
import { logging } from "../diagnostics";
const { transmitter } = logging;
import { nextBrick } from "./logic";
import { EventController } from "../extensions/event";
import { AddonContainer, INIT_TYPES } from "../extensions/addon";
import { InputController } from "./input";
const { NextBrick } = nextBrick;

export class TetrisGame {
    // [number] Bricks x count
    private _width;

    // [number] Bricks y count
    private _height;

    // [bool] ghost option
    private _SETTING_GHOST = true;

    // [Brick] current holding brick
    private _HOLDING = null;

    // [Bool] Update to graphic
    private _PENDINGUPDATE = false;

    // count of holding
    private _HOLDINGCOUNT = 0;

    // next random brick pos
    private _nextRandom;

    private _currentSequence = -1;

    // different type of bricks in game
    private _brickforms;

    // bricks in game
    private _bricks: Brick[] = [];

    // game setup
    private _setup;

    // grid color
    private _gridColor;

    // events
    private _eventController = new EventController(this);

    private _addons = new AddonContainer();

    private _simulator = null;

    private _RUNNING = true;

    private _socket = null;

    private _gameGuid;

    private _logEntries = [];

    private _graphicEngine;

    private _nextRandomGenerator;

    private _score = 0;
    getColors: () => color.Color[];
    checkLines: () => void;
    init: () => void;
    input: InputController;

    get gridColor() {
        return this._gridColor;
    }

    registerAddon(object, callback, initType) {
        this._addons.add(object, (obj) => callback(obj, this), initType);
    }

    get simulator() {
        return this._simulator;
    }

    get graphicsEngine() {
        return this._graphicEngine;
    }

    constructor(
        gameSetup?: any,
        extra: { bricks?: Brick[]; holding?: any } = null,
        graphicEngine = null,
    ) {
        this._setup = gameSetup;

        this._nextRandomGenerator = gameSetup.nextBrick || new NextBrick();

        this._graphicEngine = graphicEngine;
        if (this._graphicEngine != null) {
            this._graphicEngine.setGame(this);
        }
        if (gameSetup.logger === true) {
            this.addLogEntry({ name: "gameInit" });
        }

        this._width = gameSetup.width;
        this._height = gameSetup.height;
        this._gameGuid = Math.round(Math.random() * 10000000000000000);
        this._gridColor = new Color(0, 255, 0, 0.5);

        if (extra != null) {
            if (Array.isArray(extra.bricks)) {
                this._bricks = extra.bricks.concat();
                for (var brick of this._bricks) {
                    brick.game = this;
                }
            }

            if (extra.holding != null) {
                this._HOLDING = extra.holding;
                this._HOLDING.game = this;
            }
        }

        this.brickforms = gameSetup.brickforms;
        const colors = [
            new Color(255, 0, 0, 1),
            new Color(0, 255, 0, 1),
            new Color(0, 0, 255, 1),
            new Color(255, 255, 0, 1),
            new Color(0, 255, 255, 1),
            new Color(255, 0, 255, 1),
            new Color(0, 128, 128, 1),
        ];
        this.setNextRandom();

        var game = this;

        this.getColors = () => colors;

        function clearLine(l) {
            if (this._RUNNING) {
                this.score++;
                this.runEvent("fx", null, "sound", "gamerow");
                var bricks = game.bricks;
                ((line) => {
                    const rtn = [];
                    let times = 0;
                    for (times = 0; times <= this.width; times++) {
                        for (const i in bricks) {
                            for (const i1 in bricks[i].blocks) {
                                for (const i2 in bricks[i].blocks[i1]) {
                                    if (bricks[i].blocks[i1][i2] == 1) {
                                        const cond1 = line == bricks[i].y + parseInt(i1);
                                        const cond2 = bricks[i].moving == false;
                                        if (cond1 && cond2) {
                                            bricks.splice(parseInt(i), 1);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return rtn;
                })(l);
                ((line) => {
                    const rtn = [];
                    for (const i in bricks) {
                        for (const i1 in bricks[i].blocks) {
                            for (const i2 in bricks[i].blocks[i1]) {
                                if (bricks[i].blocks[i1][i2] == 1) {
                                    const cond1 = line > bricks[i].y + parseInt(i1);
                                    const cond2 = bricks[i].moving == false;
                                    if (cond1 && cond2) {
                                        bricks[i].y++;
                                    }
                                }
                            }
                        }
                    }

                    return rtn;
                })(l);
            }
        }
        this.checkLines = () => {
            //check for full lines
            if (this._RUNNING) {
                let cx;
                for (let i = this.height; i > 1; i--) {
                    let cnt = 0;
                    for (cx = 0; cx <= this.width - 1; cx++) {
                        if (this.checkXY(cx, i)) {
                            cnt++;
                        }
                    }
                    if (cnt == this.width) {
                        clearLine.call(this, i++);
                    }
                }
                this.PENDINGUPDATE = true;
            }
        };

        this.init = function () {
            this._RUNNING = true;
            this.score = 0;
            this.HOLDINGCOUNT = 0;

            if (this.setup.simulator === true) {
                this._simulator = attachSimulator(this);
            }

            this.addNewBrick();

            gameController.gameControlDown(this);

            if (this.setup.logger === true) {
                var socket = transmitter();
                var game = this;
                setInterval(function () {
                    if (game._socket != null && game._socket.readyState === game._socket.OPEN) {
                        let items;
                        while ((items = game._logEntries.splice(0, 1)).length > 0)
                            for (var item of items) game._socket.send(JSON.stringify(item));
                    }
                });
                this._socket = socket;
                if (global.development === true) {
                    this.socket = socket;
                }
            }

            if (this._graphicEngine != null) {
                this._graphicEngine.initializeInput();

                this._graphicEngine.initRender();
            }

            this._addons.loadByType(INIT_TYPES.AFTER_INIT);
        };

        this.input = new InputController(this);
    }

    get score() {
        return this._score;
    }

    set score(v) {
        this._score = v;
        this._eventController.trigger("update-score", null, v);
    }

    get colors() {
        return this.getColors();
    }

    get holding() {
        return this._HOLDING;
    }

    set holding(v) {
        this._HOLDING = v;
    }

    renderBrickMatrix(modifications = []) {
        return TetrisGame.renderBrickMatrix(this.width, this.height, this.bricks, modifications);
    }

    static renderBrickMatrix(
        width: number,
        height: number,
        bricks: Brick[],
        modifications: any[] = [],
    ) {
        modifications = modifications.concat();
        var result = [];
        for (let y = 0; y < height; y++) {
            result.push([]);
            for (let x = 0; x < width; x++) {
                result[result.length - 1].push(false);
            }
        }
        for (const brick of bricks) {
            var brickForm = brick.blocks;
            var x = brick.x;
            var y = brick.y;

            var matchingModifications = modifications.filter((m) => m.guid == brick.guid);
            if (matchingModifications.length > 1)
                throw new Error("There were multiple modifications found for a single brick!");
            if (matchingModifications.length == 1) {
                var mod = matchingModifications[0];

                if (typeof mod.x === "number") x = mod.x;
                if (typeof mod.y === "number") y = mod.y;
                if (typeof mod.blocks !== "undefined") brickForm = mod.blocks;

                modifications.splice(modifications.indexOf(mod), 1);
            }

            for (var i1 in brickForm) {
                for (var i2 in brickForm[i1]) {
                    if (brickForm[i1][i2] == 1) {
                        var cx = x + parseInt(i2);
                        var cy = y + parseInt(i1);
                        if (cy < 0) continue;
                        if (cy > height) continue;
                        result[cy][cx] = true;
                    }
                }
            }
        }

        if (modifications.length > 0) {
            throw new Error(`There were ${modifications.length} modifications which is not used`);
        }

        return result;
    }

    get movingSpeed() {
        return 1000;
    }

    get canUseHolding() {
        return this.HOLDINGCOUNT < 1;
    }

    getBrickId() {
        var max =
            this.bricks.length > 0 ? this.bricks.map((b) => b.id).sort((a, b) => b - a)[0] : 0;

        return max + 1;
    }

    addNewBrick(pos = -1) {
        var brick = new Brick({ game: this, ingame: true });

        brick.id = this.getBrickId();

        const brfrm = this.brickforms;
        const rnd = this.nextRandom;
        brick.color = this.getColors()[rnd].copy();
        brick.blocks = brfrm[rnd].concat();
        brick.index = rnd;

        brick.moving = true;
        brick.resetPosition();

        this.logEvent({ name: "newBrick", blocks: brick.blocks });

        this.setNextRandom();

        if (pos === -1) {
            this.bricks.push(brick);
        } else {
            this.bricks[pos] = brick;
        }

        this._eventController.trigger("current-brick-change", null);
    }

    logEvent(logObj) {
        if (this.setup.logger === true) {
            var gameGuid = this._gameGuid;
            var time = new Date().getTime();
            var obj = {
                action: "log",
                time,
                data: Object.assign({ gameGuid }, logObj),
            };
            this.addLogEntry(obj);
        }
    }

    addLogEntry(entry) {
        this._logEntries.push(entry);
    }

    holdingShift() {
        if (this.canUseHolding) {
            if (this._HOLDING == null) {
                this._HOLDING = this.getMovingBrick();
                this.addNewBrick(this.getMovingBrick().findMe());
                this.HOLDINGCOUNT++;
            } else {
                const HOLDING2 = this._HOLDING;
                this._HOLDING = this.getMovingBrick();
                HOLDING2.resetPosition();
                this.bricks[this.getMovingBrick().findMe()] = HOLDING2;
                this.HOLDINGCOUNT++;
            }
        }
    }

    getMovingBrick() {
        for (var i in this.bricks) {
            if (this.bricks[i].moving) {
                return this.bricks[i];
            }
        }
    }

    clone() {
        return new TetrisGame();
    }

    action_smashdown() {
        this.input.smashDown();
    }

    action_moveleft() {
        this.input.left();
    }

    action_rotate() {
        this.input.rotate();
    }

    action_moveright() {
        this.input.right();
    }

    action_movedown() {
        this.input.down();
    }

    get ghostDrawing() {
        return this._SETTING_GHOST;
    }

    set ghostDrawing(v) {
        this._SETTING_GHOST = v;
    }

    get brickforms() {
        return this._brickforms;
    }

    set brickforms(val) {
        this._brickforms = val;
    }

    get HOLDING() {
        return this._HOLDING;
    }

    get HOLDINGCOUNT() {
        return this._HOLDINGCOUNT;
    }

    set HOLDINGCOUNT(v) {
        this._HOLDINGCOUNT = v;
    }

    get PENDINGUPDATE() {
        return this._PENDINGUPDATE;
    }

    set PENDINGUPDATE(v) {
        this._PENDINGUPDATE = v;
    }

    get nextRandom() {
        return this._nextRandom;
    }

    set nextRandom(v) {
        this._nextRandom = v;
    }

    setNextRandom() {
        if (Array.isArray(this.setup.sequence)) {
            this._currentSequence = (this._currentSequence + 1) % this.setup.sequence.length;
            this.nextRandom = this.setup.sequence[this._currentSequence];
        } else {
            this.nextRandom = this._nextRandomGenerator.nextBrick(this);
        }
    }

    get running() {
        return this._RUNNING;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get bricks(): Brick[] {
        return this._bricks;
    }

    set bricks(v: "" | unknown) {
        if (v == "" && typeof [] == "object") {
            this.score = 0;
            this.HOLDINGCOUNT = 0;
            this._HOLDING = null;
            this._bricks = [];
        }
    }

    checkXY(x, y) {
        var bricks = this.bricks;
        for (var brick of bricks) {
            for (let j = 0, blo_len = brick.blocks.length; j < blo_len; j++) {
                for (let k = 0, brl_len = brick.blocks[j].length; k < brl_len; k++) {
                    if (brick.blocks[j][k] == 1) {
                        const cond1 = x == brick.x + ~~k;
                        const cond2 = y == brick.y + ~~j;
                        const cond3 = brick.moving == false;
                        if (cond1 && cond2 && cond3) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    get setup() {
        return this._setup;
    }

    moveTowards(x, r = null) {
        console.debug("moving to", x, r);
        var movingBrick = this.getMovingBrick();

        if (typeof r === "number") {
            if (r != this.getMovingBrick().rotation) {
                console.debug("rotating from " + this.getMovingBrick().rotation + " to " + r);
                this.action_rotate();
                return;
            }
        }

        if (movingBrick.x > x) {
            console.debug("left");
            this.action_moveleft();
        } else if (movingBrick.x < x) {
            console.debug("right");
            this.action_moveright();
        } else {
            console.debug("down");
            this.action_smashdown();
        }
    }

    addEvent(name, handler) {
        this._eventController.on(name, handler);
    }

    runEvent(name, _this, ...args) {
        this._eventController.trigger.apply(this._eventController, [name, _this].concat(args));
    }

    loseView() {
        this.runEvent("fx", null, "sound", "gamelose");
        this._RUNNING = false;
        this._eventController.trigger("lose", null);
        if (this.setup.simulator === true) {
            setTimeout(() => window.location.reload(), 2000);
        }
    }
}
