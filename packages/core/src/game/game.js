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
const { NextBrick } = nextBrick;

export class TetrisGame {
    // [number] Bricks x count
    #width;

    // [number] Bricks y count
    #height;

    // [bool] ghost option
    #SETTING_GHOST = true;

    // [Brick] current holding brick
    #HOLDING = null;

    // [Bool] Update to graphic
    #PENDINGUPDATE = false;

    // count of holding
    #HOLDINGCOUNT = 0;

    // next random brick pos
    #nextRandom;

    #currentSequence = -1;

    // different type of bricks in game
    #brickforms;

    // bricks in game
    #bricks = [];

    // game setup
    #setup;

    // grid color
    #gridColor;

    // events
    #eventController = new EventController(this);

    #addons = new AddonContainer();

    #RUNNING = true;

    #socket = null;

    #gameGuid;

    #logEntries = [];

    #graphicEngine;

    #nextRandomGenerator;

    #score = 0;

    get gridColor() {
        return this.#gridColor;
    }

    registerAddon(object, callback, initType) {
        this.#addons.add(object, (obj) => callback(obj, this), initType);
    }

    constructor(gameSetup, extra = null, graphicEngine = null) {
        this.#setup = gameSetup;

        this.#nextRandomGenerator = gameSetup.nextBrick || new NextBrick();

        this.#graphicEngine = graphicEngine;
        if (this.#graphicEngine != null) {
            this.#graphicEngine.setGame(this);
        }
        if (gameSetup.logger === true) {
            this.addLogEntry({ name: "gameInit" });
        }

        this.#width = gameSetup.width;
        this.#height = gameSetup.height;
        this.#gameGuid = Math.round(Math.random() * 10000000000000000);
        this.#gridColor = new Color(0, 255, 0, 0.5);

        if (extra != null) {
            if (Array.isArray(extra.bricks)) {
                this.#bricks = extra.bricks.concat();
                for (var brick of this.#bricks) {
                    brick.game = this;
                }
            }

            if (extra.holding != null) {
                this.#HOLDING = extra.holding;
                this.#HOLDING.game = this;
            }
        }

        this.brickforms = gameSetup.brickforms;
        const colors = [new Color(255, 0, 0, 1), new Color(0, 255, 0, 1), new Color(0, 0, 255, 1), new Color(255, 255, 0, 1), new Color(0, 255, 255, 1), new Color(255, 0, 255, 1), new Color(0, 128, 128, 1)];
        this.setNextRandom();

        var game = this;

        this.getColors = () => colors;



        function clearLine(l) {
            if (this.#RUNNING) {
                this.score++;
                this.runEvent("fx", null, "sound", "gamerow");
                var bricks = game.bricks;
                (line => {
                    const rtn = [];
                    const tx = 0;
                    let times = 0;
                    for (times = 0; times <= this.width; times++) {
                        for (const i in bricks) {
                            for (const i1 in bricks[i].blocks) {
                                for (const i2 in bricks[i].blocks[i1]) {
                                    if (bricks[i].blocks[i1][i2] == 1) {
                                        const cond1 = (line == bricks[i].y + parseInt(i1));
                                        const cond2 = (bricks[i].moving == false);
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
                (line => {
                    const rtn = [];
                    const tx = 0;
                    const times = 0;
                    for (const i in bricks) {
                        for (const i1 in bricks[i].blocks) {
                            for (const i2 in bricks[i].blocks[i1]) {
                                if (bricks[i].blocks[i1][i2] == 1) {
                                    const cond1 = (line > bricks[i].y + parseInt(i1));
                                    const cond2 = (bricks[i].moving == false);
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
            if (this.#RUNNING) {
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
        }

        this.init = function () {
            this.#RUNNING = true;
            this.score = 0;
            this.HOLDINGCOUNT = 0;

            if (this.setup.simulator === true) {
                attachSimulator(this);
            }

            this.addNewBrick();

            gameController.gameControlDown(this);

            if (this.setup.logger === true) {
                var socket = transmitter();
                var game = this;
                setInterval(function () {
                    if (game.#socket != null && game.#socket.readyState === game.#socket.OPEN) {
                        let items;
                        while ((items = game.#logEntries.splice(0, 1)).length > 0)
                            for (var item of items)
                                game.#socket.send(JSON.stringify(item));
                    }
                });
                this.#socket = socket;
                if (global.development === true) {
                    this.socket = socket;
                }
            }

            this.#graphicEngine.initializeInput();

            this.#graphicEngine.initRender();

            this.#addons.loadByType(INIT_TYPES.AFTER_INIT);
        }
    }

    get score() {
        return this.#score;
    }

    set score(v) {
        this.#score = v;
        this.#eventController.trigger("update-score", null, v);
    }

    get colors() {
        return this.getColors();
    }

    get holding() {
        return this.#HOLDING;
    }

    set holding(v) {
        this.#HOLDING = v;
    }

    renderBrickMatrix(modifications = []) {
        var result = [];
        for (var y = 0; y < this.height; y++) {
            result.push([]);
            for (var x = 0; x < this.width; x++) {
                result[result.length - 1].push(false);
            }
        }
        var bricks = this.bricks;
        for (const brick of bricks) {
            var brickForm = brick.blocks;
            var x = brick.x;
            var y = brick.y;

            var mod = modifications.filter(m => m.guid == brick.guid)[0];
            if (mod != null) {
                if (typeof (mod.x) === "number")
                    x = mod.x;
                if (typeof (mod.y) === "number")
                    y = mod.y;
                if (typeof (mod.blocks) !== "undefined")
                    brickForm = mod.blocks;
            }

            for (var i1 in brickForm) {
                for (var i2 in brickForm[i1]) {
                    if (brickForm[i1][i2] == 1) {
                        var cx = (x) + (parseInt(i2));
                        var cy = (y) + (parseInt(i1));
                        if (cy < 0)
                            continue;
                        if (cy > this.height)
                            continue;
                        result[cy][cx] = true;
                    }
                }
            }
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
        var max = this.bricks.length > 0 ? this.bricks.map(b => b.id).sort((a, b) => b - a)[0] : 0;

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

        this.#eventController.trigger("current-brick-change", null);
    }

    logEvent(logObj) {
        if (this.setup.logger === true) {
            var gameGuid = this.#gameGuid;
            var time = new Date().getTime();
            var obj = {
                action: "log",
                time,
                data: Object.assign({ gameGuid }, logObj),
            };
            this.addLogEntry(obj)
        }
    }

    addLogEntry(entry) {
        this.#logEntries.push(entry);
    }

    holdingShift() {
        if (this.canUseHolding) {
            if (this.#HOLDING == null) {
                this.#HOLDING = this.getMovingBrick();
                this.addNewBrick(this.getMovingBrick().findMe());
                this.HOLDINGCOUNT++;
            } else {
                const HOLDING2 = this.#HOLDING;
                this.#HOLDING = this.getMovingBrick();
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
        this.getMovingBrick().smashdown(true);
    }

    action_moveleft() {
        this.getMovingBrick().moveleft();
    }

    action_rotate() {
        this.getMovingBrick().rotate();
    }

    action_moveright() {
        this.getMovingBrick().moveright();
    }

    action_movedown() {
        this.getMovingBrick().movedown();
    }

    get ghostDrawing() {
        return this.#SETTING_GHOST;
    }

    set ghostDrawing(v) {
        this.#SETTING_GHOST = v;
    }

    get brickforms() {
        return this.#brickforms;
    }

    set brickforms(val) {
        this.#brickforms = val;
    }

    get HOLDING() {
        return this.#HOLDING;
    }

    get HOLDINGCOUNT() {
        return this.#HOLDINGCOUNT;
    }

    set HOLDINGCOUNT(v) {
        this.#HOLDINGCOUNT = v;
    }

    get PENDINGUPDATE() {
        return this.#PENDINGUPDATE;
    }

    set PENDINGUPDATE(v) {
        return this.#PENDINGUPDATE = v;
    }

    get nextRandom() {
        return this.#nextRandom;
    }

    set nextRandom(v) {
        this.#nextRandom = v;
    }

    setNextRandom() {
        if (Array.isArray(this.setup.sequence)) {
            this.#currentSequence = (this.#currentSequence + 1) % this.setup.sequence.length;
            this.nextRandom = this.setup.sequence[this.#currentSequence];
        } else {
            this.nextRandom = this.#nextRandomGenerator.nextBrick(this);
        }
    }

    get running() {
        return this.#RUNNING;
    }

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
    }

    get bricks() {
        return this.#bricks;
    }

    set bricks(v) {
        if ((v == "") && (typeof ([]) == "object")) {
            this.score = 0;
            this.HOLDINGCOUNT = 0;
            this.#HOLDING = null;
            this.#bricks = [];
        } else {
            return false;
        }
    }

    checkXY(x, y) {
        var bricks = this.bricks;
        for (var brick of bricks) {
            for (let j = 0, blo_len = brick.blocks.length; j < blo_len; j++) {
                for (let k = 0, brl_len = brick.blocks[j].length; k < brl_len; k++) {
                    if (brick.blocks[j][k] == 1) {
                        const cond1 = (x == brick.x + parseInt(k));
                        const cond2 = (y == brick.y + parseInt(j));
                        const cond3 = (brick.moving == false);
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
        return this.#setup;
    }

    moveTowards(x, r = null) {
        console.debug("moving to", x, r);
        var movingBrick = this.getMovingBrick();

        if (typeof (r) === "number") {
            if (r != this.getMovingBrick().rotation) {
                console.debug("rotating from " + this.getMovingBrick().rotation + " to " + r);
                this.action_rotate();
                return;
            }
        }

        if (movingBrick.x > x) {
            console.debug("left");
            this.action_moveleft();
        }
        else if (movingBrick.x < x) {
            console.debug("right");
            this.action_moveright();
        }
        else {
            console.debug("down");
            this.action_smashdown();
        }
    }

    addEvent(name, handler) {
        this.#eventController.on(name, handler);
    }

    runEvent(name, _this, ...args) {
        this.#eventController.trigger.apply(this.#eventController, [name, _this].concat(args));
    }

    loseView() {
        this.runEvent("fx", null, "sound", "gamelose");
        this.#RUNNING = false;
        this.#eventController.trigger("lose", null);
        if (this.setup.simulator === true) {
            setTimeout(() => window.location.reload(), 2000);
        }
    }
}