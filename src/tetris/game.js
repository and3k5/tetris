import Color from "./color.js";
import { RadialGradient, LinearGradient } from "./gradient.js";
import Brick from "./brick.js";
import { playSound } from "./sound.js";
import { BinaryBrickForm } from "./brick-form.js";
import * as gameGraphic from "./game-graphic.js";
import * as gameController from "./game-controller.js";
import { attachSimulator } from "./simulate.js";
import * as console from "../utils/trace.js";

window.BinaryBrickForm = BinaryBrickForm;

class TetrisGame {
    // [number] Bricks x count
    #WIDTH;

    // [number] Bricks y count
    #HEIGHT;

    // [number] Size of a brick (in pixels)
    #BRICKSIZE;

    // [number] canvas width (soon to be deleted)
    #CANVAS_WIDTH;

    // [number] canvas height (soon to be deleted)
    #CANVAS_HEIGHT;

    // [bool] ghost option
    #SETTING_GHOST = true;

    // [number] Width of grid
    #GRID_WIDTH;

    // [number] Height of grid
    #GRID_HEIGHT;

    // [Brick] current holding brick
    #HOLDING = null;

    // [Bool] Update to graphic
    #PENDINGUPDATE = false;

    // count of holding
    #HOLDINGCOUNT = 0;

    // next random brick pos
    #nextRandom;

    // different type of bricks in game
    #brickforms;

    // bricks in game
    #bricks = [];

    // game setup
    #setup;

    // [Graphic Context] Game 2d context
    #ctx;

    // grid color
    #gridColor;

    // events
    #events = [];

    #RUNNING = true;

    #runEvent;

    constructor(gameSetup, extra = null) {
        this.#setup = gameSetup;
        this.#WIDTH = gameSetup.width;
        this.#HEIGHT = gameSetup.height;
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

        let // [number] Board font size
            GRAPHIC_BOARD_FONTSIZE;

        let // [number] Score font size
            GRAPHIC_SCORE_FONTSIZE;

        let // [Graphic Context] Game holding brick 2d context
            h_ctx;

        let // [Graphic Context] Game next brick 2d context
            n_ctx;

        let // [number] Current showing screen
            WHERE = -1;

        const // 0 = menu
            // 1 = ingame
            // 2 = paused
            // 3 = tutorial
            // 4 = about
            // 5 = lost game
            // 6 = Settings
            // [number] Unused (might be removed)
            FROM = 0;

        const // [number] Selected menu item
            SELECTED_MENU = 0;

        let scoreelement = null;

        let SCORE = 0;


        this.brickforms = gameSetup.brickforms;
        const colors = [new Color(255, 0, 0, 1), new Color(0, 255, 0, 1), new Color(0, 0, 255, 1), new Color(255, 255, 0, 1), new Color(0, 255, 255, 1), new Color(255, 0, 255, 1), new Color(0, 128, 128, 1)];
        this.nextRandom = Math.round(Math.random() * (this.brickforms.length - 1));

        var game = this;

        function setScore(v) {
            SCORE = v;
            scoreelement.innerHTML = SCORE;
        }

        this.getColors = () => colors;
        this.getRUNNING = () => this.#RUNNING;
        this.getWIDTH = () => game.#WIDTH;



        function clearLine(l) {
            if (this.#RUNNING) {
                setScore(SCORE + 1);
                playSound("gamerow");
                var bricks = game.bricks;
                const toDelete = (line => {
                    const rtn = [];
                    const tx = 0;
                    let times = 0;
                    for (times = 0; times <= this.#WIDTH; times++) {
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
                const movedown = (line => {
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
                for (let i = this.#HEIGHT; i > 1; i--) {
                    let cnt = 0;
                    for (cx = 0; cx <= this.#WIDTH - 1; cx++) {
                        if (this.checkXY(cx, i)) {
                            cnt++;
                        }
                    }
                    if (cnt == this.#WIDTH) {
                        clearLine.call(this, i++);
                    }
                }
                this.PENDINGUPDATE = true;
            }
        }

        function tiles(ctx) {
            // Grid
            return 0;
            var ix = 0;
            var iy = 0;
            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgba(0,255,0,0.5)";
            ctx.fillStyle = "white";
            for (var ix = 0; ix <= (this.#GRID_WIDTH); ix += this.#BRICKSIZE) {
                ctx.beginPath();
                ctx.lineTo(ix, 0);
                ctx.lineTo(ix, this.#GRID_HEIGHT);
                ctx.closePath();
                ctx.stroke();
            }
            for (var iy = 0; iy <= (this.#GRID_HEIGHT); iy += this.#BRICKSIZE) {
                ctx.beginPath();
                ctx.lineTo(0, iy);
                ctx.lineTo(this.#GRID_WIDTH, iy);
                ctx.closePath();
                ctx.stroke();
            }
        }

        function keyh(e) {
            switch (e.keyCode) {
                case 37:
                    // left
                    e.preventDefault();
                    if (game.getRUNNING())
                        game.action_moveleft();
                    break;
                case 38:
                    // up
                    e.preventDefault();
                    if (game.getRUNNING())
                        game.action_rotate();
                    break;
                case 39:
                    // right
                    e.preventDefault();
                    if (game.getRUNNING())
                        game.action_moveright();
                    break;
                case 40:
                    // down
                    e.preventDefault();
                    if (game.getRUNNING())
                        game.action_movedown();
                    break;
                case 32:
                    // space
                    e.preventDefault();
                    if (game.getRUNNING() && e.repeat !== true)
                        game.action_smashdown();
                    break;
                case 27:
                    // escape
                    e.preventDefault();
                    if (game.getRUNNING()) {
                        // ingame
                        menuNav("paused");
                        playSound("menuback");
                    }
                    break;
                case 16:
                    // shift
                    e.preventDefault();
                    if (game.getRUNNING()) {
                        game.holdingShift();
                    }
                    break;
            }
        }
        function graphicControlLoop(game, ctx, h_ctx, n_ctx) {
            // CTX GRAPHICS
            requestAnimationFrame(() => graphicControlLoop(game, ctx, h_ctx, n_ctx));
            if (game.PENDINGUPDATE) {
                game.inGameGraphic(ctx, h_ctx, n_ctx);
                game.PENDINGUPDATE = false;
            }
        }
        this.init = function (g, h, n, sc) {
            this.#BRICKSIZE = 30;

            this.#CANVAS_WIDTH = this.#BRICKSIZE * this.#WIDTH;
            this.#CANVAS_HEIGHT = this.#BRICKSIZE * this.#HEIGHT;

            this.#GRID_WIDTH = this.#WIDTH * this.#BRICKSIZE;
            this.#GRID_HEIGHT = this.#HEIGHT * this.#BRICKSIZE;

            // GRAPHIC_FONT = "Verdana";
            // GRAPHIC_MENU_FONTSIZE = this.#BRICKSIZE * 0.75;
            // GRAPHIC_MENUDESC_FONTSIZE = this.#BRICKSIZE;
            // GRAPHIC_MENU_DISTANCE = GRAPHIC_MENU_FONTSIZE * 1.5;
            GRAPHIC_BOARD_FONTSIZE = this.#BRICKSIZE - 5;
            GRAPHIC_SCORE_FONTSIZE = this.#BRICKSIZE;
            WHERE = 1;
            this.#RUNNING = true;
            scoreelement = sc;
            setScore(0);
            this.HOLDINGCOUNT = 0;
            this.addNewBrick();

            var runEvent = (function (name) {
                for (var event of this.#events) {
                    if (event.name === name) {
                        event.handler();
                    }
                }
            }).bind(this);

            gameController.gameControlDown(this, g, runEvent);
            this.#runEvent = runEvent;

            if (this.setup.simulator === true) {
                attachSimulator(this);
            }

            window.addEventListener("keydown", keyh, false);

            var touchStart = null;

            g.addEventListener("touchstart", function (event) {
                var touch = event.changedTouches[0];
                touchStart = { x: touch.screenX, y: touch.screenY };
            });
            g.addEventListener("touchend", function (event) {
                var touch = event.changedTouches[0];
                var touchEnd = { x: touch.screenX, y: touch.screenY };

                var deltaX = touchEnd.x - touchStart.x;
                var deltaY = touchEnd.y - touchStart.y;
                var rad = Math.atan2(deltaY, deltaX);
                var deg = rad * (180 / Math.PI);

                while (deg < 0)
                    deg += 360;

                if (deg > 120 && deg < 220) {
                    game.action_moveleft();
                } else if (deg > 340 || deg < 40) {
                    game.action_moveright();
                } else if (deg < 115 && deg > 65) {
                    game.action_smashdown();
                } else {
                    console.debug(deg);
                }
            });

            h.addEventListener("click", function () {
                game.holdingShift();
            });

            this.#ctx = g.getContext("2d");
            h_ctx = h.getContext("2d");
            n_ctx = n.getContext("2d");

            this.clearAndResize(this.#ctx, h_ctx, n_ctx);
            graphicControlLoop(this, this.#ctx, h_ctx, n_ctx);
        }
    }

    clearAndResize(ctx, h_ctx, n_ctx) {
        this.clearCanvas(ctx, this.#CANVAS_WIDTH, this.#CANVAS_HEIGHT);
        this.clearCanvas(h_ctx, this.#BRICKSIZE * 4, this.#BRICKSIZE * 4);
        this.clearCanvas(n_ctx, this.#BRICKSIZE * 4, this.#BRICKSIZE * 4);
    }

    clearCanvas(ctx, w, h) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.canvas.width = w;
        ctx.canvas.height = h;
    }

    inGameGraphic(ctx, h_ctx, n_ctx) {
        this.clearAndResize(ctx, h_ctx, n_ctx);

        const BRICKSIZESCALE = 1.5;
        gameGraphic.drawGrid(ctx, this.#gridColor, this.#BRICKSIZE, this.#BRICKSIZE, this.WIDTH, this.HEIGHT);
        var smallBrickSize = this.#BRICKSIZE / BRICKSIZESCALE;
        gameGraphic.drawGrid(n_ctx, this.#gridColor, smallBrickSize, smallBrickSize, 6, 6);
        gameGraphic.drawGrid(h_ctx, this.#gridColor, smallBrickSize, smallBrickSize, 6, 6);
        //tiles(ctx);
        var bricks = this.bricks;
        for (const i in bricks) {
            if (this.#SETTING_GHOST && bricks[i].moving) {
                var ghostColor = new Color(255, 255, 255, 0.2);
                //ctx.fillStyle="rgba(255,255,255,0.5)";
                const tmp_lowestPos = bricks[i].getLowestPosition(bricks);
                this.drawBrickForm(bricks[i].blocks, ctx, bricks[i].x, tmp_lowestPos, ghostColor)
            }
            this.drawBrickForm(bricks[i].blocks, ctx, bricks[i].x, bricks[i].y, bricks[i].color);
        }
        // NextBox field

        var brickforms = this.brickforms;

        var colors = this.getColors();

        var nextBrickForm = brickforms[this.nextRandom];
        var nextBrickColor = colors[this.nextRandom];

        this.drawBrickForm(nextBrickForm, n_ctx, 2, 2, nextBrickColor, BRICKSIZESCALE);

        // HoldingField
        h_ctx.lineWidth = 1;
        h_ctx.strokeStyle = "rgba(0,255,0,0.5)";
        h_ctx.fillStyle = "white";

        if (this.#HOLDING != null) {
            this.drawBrickForm(this.#HOLDING.blocks, h_ctx, 0, 0, this.#HOLDING.color, BRICKSIZESCALE);
        }
    }

    drawBrickForm(brickForm, ctx, x, y, color, scale = 1) {
        var brickSize = this.#BRICKSIZE / scale;

        for (var i1 in brickForm) {
            for (var i2 in brickForm[i1]) {
                if (brickForm[i1][i2] == 1) {
                    this.makeBrick(ctx, (x * brickSize) + (parseInt(i2) * brickSize), (y * brickSize) + (parseInt(i1) * brickSize), brickSize, brickSize, color);
                    // this.makeBrick(ctx, (bricks[i].x * brickSize) + (parseInt(i2) * brickSize), (bricks[i].y * brickSize) + (parseInt(i1) * brickSize), brickSize, brickSize, bricks[i].color);
                }
            }
        }
    }

    renderBrickMatrix() {
        var result = [];
        for (var y = 0; y < this.HEIGHT; y++) {
            result.push([]);
            for (var x = 0; x < this.WIDTH; x++) {
                result[result.length - 1].push(false);
            }
        }
        var bricks = this.bricks;
        for (const brick of bricks) {
            var brickForm = brick.blocks;
            var x = brick.x;
            var y = brick.y;

            for (var i1 in brickForm) {
                for (var i2 in brickForm[i1]) {
                    if (brickForm[i1][i2] == 1) {
                        var cx = (x) + (parseInt(i2));
                        var cy = (y) + (parseInt(i1));
                        if (cy < 0)
                            continue;
                        result[cy][cx] = true;
                    }
                }
            }
        }

        return result;
    }

    drawSingleBrick(x, y, color) {
        var brickSize = this.#BRICKSIZE;
        this.makeBrick(this.#ctx, (x * brickSize), (y * brickSize), brickSize, brickSize, color);
    }

    drawBrick(brick, color = null) {
        var brickSize = this.#BRICKSIZE;
        this.drawBrickForm(brick.blocks, this.#ctx, brick.x, brick.y, color || brick.color);
    }

    makeBrick(ctx, x, y, w, h, color) {
        var fstyle = new RadialGradient(ctx, x + (w / 2), y + (h / 2), 0, x + (w / 2), y + (h / 2), 40);
        fstyle.addColor(0, color);
        fstyle.addColor(1, color.alphaScale(0.5));
        ctx.fillStyle = fstyle.compile();
        ctx.fillRect(x, y, w, h);

        var fstyle = new LinearGradient(ctx, x + (w / 2), y, x + (w / 2), y + h);
        fstyle.addColor(0.2, color.alpha(0.5));
        fstyle.addColor(0, Color.Black().alpha(0.9));
        ctx.fillStyle = fstyle.compile();
        ctx.fillRect(x, y, w, h);

        var fstyle = new LinearGradient(ctx, x, y + (h / 2), x + w, y + (h / 2));
        fstyle.addColor(0.3, color.scale(0.7).alpha(0));
        fstyle.addColor(0, Color.Black().alpha(0.4));
        ctx.fillStyle = fstyle.compile();
        ctx.fillRect(x, y, w, h);

        var fstyle = new LinearGradient(ctx, x + (w / 2), y, x + (w / 2), y + h);
        fstyle.addColor(0.8, color.scale(0.1).alpha(0));
        fstyle.addColor(1, Color.Black());
        ctx.fillStyle = fstyle.compile();
        ctx.fillRect(x, y, w, h);

        var fstyle = new LinearGradient(ctx, x, y + (h / 2), x + w, y + (h / 2));
        fstyle.addColor(0.8, color.scale(0.2).alpha(0));
        fstyle.addColor(1, Color.Black());
        ctx.fillStyle = fstyle.compile();
        ctx.fillRect(x, y, w, h);
    }

    get movingSpeed() {
        return 1000;
    }

    get canUseHolding() {
        return this.HOLDINGCOUNT < 1;
    }

    addNewBrick(pos = -1) {
        var brick = new Brick({ game: this, ingame: true });

        const brfrm = this.brickforms;
        const rnd = this.nextRandom;
        brick.color = this.getColors()[rnd].copy();
        brick.blocks = brfrm[rnd].concat();
        brick.moving = true;
        brick.resetPosition();
        this.nextRandom = Math.round(Math.random() * (brfrm.length - 1));

        if (pos === -1) {
            this.bricks.push(brick);
        } else {
            this.bricks[pos] = brick;
        }
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

    get WIDTH() {
        return this.#WIDTH;
    }

    get HEIGHT() {
        return this.#HEIGHT;
    }

    get bricks() {
        return this.#bricks;
    }

    set bricks(v) {
        if ((v == "") && (typeof ([]) == "object")) {
            setScore(0);
            this.HOLDINGCOUNT = 0;
            this.#HOLDING = null;
            this.#bricks = [];
        } else {
            return false;
        }
    }

    checkXY(x, y) {
        var bricks = this.bricks;
        for (let i = 0, bri_len = bricks.length; i < bri_len; i++) {
            for (let j = 0, blo_len = bricks[i].blocks.length; j < blo_len; j++) {
                for (let k = 0, brl_len = bricks[i].blocks[j].length; k < brl_len; k++) {
                    if (bricks[i].blocks[j][k] == 1) {
                        const cond1 = (x == bricks[i].x + parseInt(k));
                        const cond2 = (y == bricks[i].y + parseInt(j));
                        const cond3 = (bricks[i].moving == false);
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
            if (r != this.getMovingBrick().rotation)
            {
                console.debug("rotating from "+this.getMovingBrick().rotation+" to "+r);
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
        this.#events.push({
            name,
            handler,
        });
    }

    loseView() {
        playSound("gamelose");
        this.#RUNNING = false;
        this.#runEvent("lose");
        if (this.setup.simulator === true)
        {
            setTimeout(() => window.location.reload(),2000);
        }
    }
}

export default TetrisGame