import Color from "./color.js";
import { RadialGradient, LinearGradient } from "./gradient.js";
import Brick from "./brick.js";
import { playSound } from "./sound.js";
import { BinaryBrickForm } from "./brick-form.js";

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

    constructor() {
        const // [number] FPS counter
            FPS = 0;

        let // [Bool] Update to graphic
            PENDINGUPDATE = false;

        let // [string] Font name
            GRAPHIC_FONT;

        let // [number] Menu font size
            GRAPHIC_MENU_FONTSIZE;

        let // [number] Menu subtext font size
            GRAPHIC_MENUDESC_FONTSIZE;

        let // [number] Menu ???
            GRAPHIC_MENU_DISTANCE;

        let // [number] Board font size
            GRAPHIC_BOARD_FONTSIZE;

        let // [number] Score font size
            GRAPHIC_SCORE_FONTSIZE;

        let // [bool] running
            RUNNING = true;

        let // [Graphic Context] Game 2d context
            ctx;

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

        let // count of holding
            HOLDINGCOUNT = 0;

        let scoreelement = null;

        let // Fix to avoid Space to repeat keydown events
            MAYDROP = true;

        let SCORE = 0;
        let bricks = [];

        const bricksform = [
            [[0, 1, 0],
            [0, 1, 0],
            [0, 1, 1]],

            [[0, 1, 0],
            [0, 1, 0],
            [1, 1, 0]],

            [[0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]],

            [[1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]],

            [[0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]],

            [[1, 1],
            [1, 1]],

            [[0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0]]
        ];

        const colors = [new Color(255, 0, 0, 1), new Color(0, 255, 0, 1), new Color(0, 0, 255, 1), new Color(255, 255, 0, 1), new Color(0, 255, 255, 1), new Color(255, 0, 255, 1), new Color(0, 128, 128, 1)];
        let nextRandom = Math.round(Math.random() * (bricksform.length - 1));

        var game = this;

        function setScore(v) {
            SCORE = v;
            scoreelement.innerHTML = SCORE;
        }
        Object.defineProperties(this, {
            "bricks": {
                get() {
                    return bricks;
                },
                set(v) {
                    if ((v == "") && (typeof ([]) == "object")) {
                        setScore(0);
                        HOLDINGCOUNT = 0;
                        this.#HOLDING = null;
                        bricks = [];
                    } else {
                        return false;
                    }
                }
            },
            "WIDTH": {
                get() {
                    return this.#WIDTH;
                }
            },
            "HEIGHT": {
                get() {
                    return this.#HEIGHT;
                }
            },
            "HOLDINGCOUNT": {
                get() {
                    return HOLDINGCOUNT;
                },
                set(v) {
                    HOLDINGCOUNT = v;
                }
            },
            "PENDINGUPDATE": {
                get() {
                    return PENDINGUPDATE;
                },
                set(v) {
                    PENDINGUPDATE = v;
                }
            },
            "nextRandom": {
                get() {
                    return nextRandom;
                },
                set(v) {
                    nextRandom = v;
                }
            },
            "MAYDROP": {
                get() {
                    return MAYDROP;
                },
                set(v) {
                    MAYDROP = v;
                }
            }
        });

        this.getBricksform = () => bricksform;
        this.getColors = () => colors;
        //this.getMAYDROP=function () { return MAYDROP; };
        this.getRUNNING = () => RUNNING;
        this.getWIDTH = () => game.#WIDTH;
        this.bricksform = bricksform;

        function checkXY(x, y) {
            var bri_len;
            var blo_len;
            var brl_len;
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
        function clearLine(l) {
            if (RUNNING) {
                setScore(SCORE + 1);
                playSound("gamerow");
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
            if (RUNNING) {
                let cx;
                for (let i = this.#HEIGHT; i > 1; i--) {
                    let cnt = 0;
                    for (cx = 0; cx <= this.#WIDTH - 1; cx++) {
                        if (checkXY(cx, i)) {
                            cnt++;
                        }
                    }
                    if (cnt == this.#WIDTH) {
                        clearLine.call(this, i++);
                    }
                }
                PENDINGUPDATE = true;
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

        let GAMECONTROLDOWN = false;
        const MOVESPEED = 1000;
        function gameControlDown() {
            if (GAMECONTROLDOWN == false) {
                const func = () => {
                    GAMECONTROLDOWN = true;
                    if (WHERE == 1) {
                        game.getMovingBrick().movedown();
                        setTimeout(func, MOVESPEED);
                    } else {
                        GAMECONTROLDOWN = false;
                    }
                };
                func();
            }
        }
        function keyh(e) {
            switch (e.keyCode) {
                case 37:
                    // left
                    e.preventDefault();
                    if (RUNNING)
                        game.action_moveleft();
                    break;
                case 38:
                    // up
                    e.preventDefault();
                    if (RUNNING)
                        game.action_rotate();
                    break;
                case 39:
                    // right
                    e.preventDefault();
                    if (RUNNING)
                        game.action_moveright();
                    break;
                case 40:
                    // down
                    e.preventDefault();
                    if (RUNNING)
                        game.action_movedown();
                    break;
                case 32:
                    // space
                    e.preventDefault();
                    if (RUNNING)
                        game.action_smashdown();
                    break;
                case 27:
                    // escape
                    e.preventDefault();
                    if (RUNNING) {
                        // ingame
                        menuNav("paused");
                        playSound("menuback");
                    }
                    break;
                case 16:
                    // shift
                    e.preventDefault();
                    if (RUNNING) {
                        game.holdingShift();
                    }
                    break;
            }
        }
        function keyup({ keyCode }) {
            if (keyCode == 32)
                MAYDROP = true;
        }
        function graphicControlLoop(game, ctx, h_ctx, n_ctx) {
            // CTX GRAPHICS
            requestAnimationFrame(() => graphicControlLoop(game, ctx, h_ctx, n_ctx));
            if (PENDINGUPDATE) {
                game.inGameGraphic(ctx, h_ctx, n_ctx);
                PENDINGUPDATE = false;
            }
        }
        this.init = function (g, h, n, sc) {
            this.#WIDTH = 10;
            this.#HEIGHT = 20;
            this.#BRICKSIZE = 30;

            this.#CANVAS_WIDTH = this.#BRICKSIZE * this.#WIDTH;
            this.#CANVAS_HEIGHT = this.#BRICKSIZE * this.#HEIGHT;

            this.#GRID_WIDTH = this.#WIDTH * this.#BRICKSIZE;
            this.#GRID_HEIGHT = this.#HEIGHT * this.#BRICKSIZE;

            GRAPHIC_FONT = "Verdana";
            GRAPHIC_MENU_FONTSIZE = this.#BRICKSIZE * 0.75;
            GRAPHIC_MENUDESC_FONTSIZE = this.#BRICKSIZE;
            GRAPHIC_MENU_DISTANCE = GRAPHIC_MENU_FONTSIZE * 1.5;
            GRAPHIC_BOARD_FONTSIZE = this.#BRICKSIZE - 5;
            GRAPHIC_SCORE_FONTSIZE = this.#BRICKSIZE;
            WHERE = 1;
            RUNNING = true;
            bricks = [];
            scoreelement = sc;
            setScore(0);
            HOLDINGCOUNT = 0;
            this.#HOLDING = null;
            bricks.push(new Brick({
                ingame: true,
                game: this
            }));
            gameControlDown();

            window.addEventListener("keydown", keyh, false);
            window.addEventListener("keyup", keyup, false);

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
                    console.log(deg);
                }
            });

            h.addEventListener("click",function () {
                game.holdingShift();
            });

            ctx = /*document.querySelector("canvas#game")*/
                g.getContext("2d");
            h_ctx = /*document.querySelector("canvas#holding")*/
                h.getContext("2d");
            n_ctx = /*document.querySelector("canvas#next")*/
                n.getContext("2d");
            this.clearAndResize(ctx, h_ctx, n_ctx);
            graphicControlLoop(this, ctx, h_ctx, n_ctx);
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
        const BRICKSIZESCALE = 1.5;

        var bricksform = this.getBricksform();

        var colors = this.getColors();

        var nextBrickForm = bricksform[this.nextRandom];
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

    holdingShift() {
        if (this.HOLDINGCOUNT < 1) {
            if (this.#HOLDING == null) {
                this.#HOLDING = this.getMovingBrick();
                this.bricks[this.getMovingBrick().findMe()] = new Brick({
                    ingame: true,
                    game: this
                });
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
        var i;
        for (var i in this.bricks) {
            if (this.bricks[i].moving) {
                return this.bricks[i];
            }
        }
    }

    action_smashdown() {
        this.getMovingBrick().smashdown();
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

    get bricksform() {
        return this._value;
    }

    set bricksform(val) {
        this._value = val;
    }
}

export default TetrisGame