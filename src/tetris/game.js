import Color from "./color.js";
import Brick from "./brick.js";
import { playSound } from "./sound.js";

class TetrisGame {
    constructor() {
        let // [number] Bricks x count
        WIDTH;

        let // [number] Bricks y count
        HEIGHT;

        let // [number] Size of a brick (in pixels)
        BRICKSIZE;

        let // [number] Width of grid
        GRID_WIDTH;

        let // [number] Height of grid
        GRID_HEIGHT;

        let // [number] canvas width (soon to be deleted)
        CANVAS_WIDTH;

        let // [number] canvas height (soon to be deleted)
        CANVAS_HEIGHT;

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

        const // [number/bool] If webaudio doesnt work, then skip download
        webAudioApiFailed = 0;

        const // [number] Selected menu item
        SELECTED_MENU = 0;

        const // [bool] ghost option
        SETTING_GHOST = true;

        let // [Brick] current holding brick
        HOLDING = null;

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

        function setScore(v) {
            SCORE = v;
            scoreelement.innerHTML = SCORE;
        }
        Object.defineProperties(this, {
            "bricks" : {
                get() {
                    return bricks;
                },
                set(v) {
                    if ((v == "") && (typeof([]) == "object")) {
                        setScore(0);
                        HOLDINGCOUNT = 0;
                        HOLDING = null;
                        bricks = [];
                    } else {
                        return false;
                    }
                }
            },
            "WIDTH" : {
                get() {
                    return WIDTH;
                },
                set(v) {
                    return false;
                }
            },
            "HEIGHT" : {
                get() {
                    return HEIGHT;
                },
                set(v) {
                    return false;
                }
            },
            "HOLDINGCOUNT" : {
                get() {
                    return HOLDINGCOUNT;
                },
                set(v) {
                    HOLDINGCOUNT = v;
                }
            },
            "PENDINGUPDATE" : {
                get() {
                    return PENDINGUPDATE;
                },
                set(v) {
                    PENDINGUPDATE = v;
                }
            },
            "nextRandom" : {
                get() {
                    return nextRandom;
                },
                set(v) {
                    nextRandom = v;
                }
            },
            "MAYDROP" : {
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
        this.getWIDTH = () => WIDTH;
        this.bricksform = bricksform;

        function checkXY(x, y) {
            var bri_len;
            var blo_len;
            var brl_len;
            for (let i=0, bri_len=bricks.length;i<bri_len;i++) {
                for (let j=0, blo_len=bricks[i].blocks.length;j<blo_len;j++) {
                    for (let k=0, brl_len=bricks[i].blocks[j].length;k<brl_len;k++) {
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
                    for (times = 0; times <= WIDTH; times++) {
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
                for (let i = HEIGHT; i > 1; i--) {
                    let cnt = 0;
                    for (cx = 0; cx <= WIDTH - 1; cx++) {
                        if (checkXY(cx, i)) {
                            cnt++;
                        }
                    }
                    if (cnt == WIDTH) {
                        clearLine(i++);
                    }
                }
                PENDINGUPDATE = true;
            }
        }
        function makeBrick(ctx, x, y, w, h, {r, g, b, a}) {
            var fstyle = ctx.createRadialGradient(x + (w / 2), y + (h / 2), 0, x + (w / 2), y + (h / 2), 40);
            fstyle.addColorStop(0, new Color(r, g, b, a).toRGBAString());
            fstyle.addColorStop(1, new Color(r, g, b, a * 0.5).toRGBAString());
            ctx.fillStyle = fstyle;
            ctx.fillRect(x, y, w, h);
            var fstyle = ctx.createLinearGradient(x + (w / 2), y, x + (w / 2), y + h);
            fstyle.addColorStop(0.2, new Color(r, g, b, 0.5).toRGBAString());
            fstyle.addColorStop(0, new Color(0, 0, 0, 0.9).toRGBAString());
            ctx.fillStyle = fstyle;
            ctx.fillRect(x, y, w, h);
            var fstyle = ctx.createLinearGradient(x, y + (h / 2), x + w, y + (h / 2));
            fstyle.addColorStop(0.3, new Color(r * 0.7, g * 0.7, b * 0.7, 0).toRGBAString());
            fstyle.addColorStop(0, new Color(0, 0, 0, 0.4).toRGBAString());
            ctx.fillStyle = fstyle;
            ctx.fillRect(x, y, w, h);
            var fstyle = ctx.createLinearGradient(x + (w / 2), y, x + (w / 2), y + h);
            fstyle.addColorStop(0.8, new Color(r * 0.1, g * 0.1, b * 0.1, 0).toRGBAString());
            fstyle.addColorStop(1, new Color(0, 0, 0, 1).toRGBAString());
            ctx.fillStyle = fstyle;
            ctx.fillRect(x, y, w, h);
            var fstyle = ctx.createLinearGradient(x, y + (h / 2), x + w, y + (h / 2));
            fstyle.addColorStop(0.8, new Color(r * 0.2, g * 0.2, b * 0.2, 0).toRGBAString());
            fstyle.addColorStop(1, new Color(0, 0, 0, 1).toRGBAString());
            ctx.fillStyle = fstyle;
            ctx.fillRect(x, y, w, h);
        }

        function getMovingBrick() {
            var i;
            for (var i in bricks) {
                if (bricks[i].moving) {
                    return bricks[i];
                }
            }
        }

        function holdingShift() {
            if (HOLDINGCOUNT < 1) {
                if (HOLDING == null) {
                    HOLDING = getMovingBrick();
                    bricks[getMovingBrick().findMe()] = new Brick({
                            ingame : true,
                            game : getMovingBrick().game
                        });
                    HOLDINGCOUNT++;
                } else {
                    const HOLDING2 = HOLDING;
                    HOLDING = getMovingBrick();
                    HOLDING2.resetPosition();
                    bricks[getMovingBrick().findMe()] = HOLDING2;
                    HOLDINGCOUNT++;
                }
            }
        }
        function clearAndResize(ctx) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.canvas.width = CANVAS_WIDTH;
            ctx.canvas.height = CANVAS_HEIGHT;

            h_ctx.clearRect(0, 0, h_ctx.canvas.width, h_ctx.canvas.height);
            h_ctx.canvas.width = BRICKSIZE * 4;
            h_ctx.canvas.height = BRICKSIZE * 4;

            n_ctx.clearRect(0, 0, n_ctx.canvas.width, n_ctx.canvas.height);
            n_ctx.canvas.width = BRICKSIZE * 4;
            n_ctx.canvas.height = BRICKSIZE * 4;
        }
        function tiles(ctx) {
            // Grid
            return 0;
            var ix = 0;
            var iy = 0;
            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgba(0,255,0,0.5)";
            ctx.fillStyle = "white";
            for (var ix = 0; ix <= (GRID_WIDTH); ix += BRICKSIZE) {
                ctx.beginPath();
                ctx.lineTo(ix, 0);
                ctx.lineTo(ix, GRID_HEIGHT);
                ctx.closePath();
                ctx.stroke();
            }
            for (var iy = 0; iy <= (GRID_HEIGHT); iy += BRICKSIZE) {
                ctx.beginPath();
                ctx.lineTo(0, iy);
                ctx.lineTo(GRID_WIDTH, iy);
                ctx.closePath();
                ctx.stroke();
            }
        }
        function inGameGraphic(ctx) {
            clearAndResize(ctx);
            tiles(ctx);
            for (const i in bricks) {
                if (SETTING_GHOST) {
                    if (bricks[i].moving) {
                        //ctx.fillStyle="rgba(255,255,255,0.5)";
                        const tmp_lowestPos = bricks[i].getLowestPosition(bricks);
                        for (var i1 in bricks[i].blocks) {
                            for (var i2 in bricks[i].blocks[i1]) {
                                if (bricks[i].blocks[i1][i2] == 1) {
                                    if ((((tmp_lowestPos * BRICKSIZE) + (parseInt(i1) * BRICKSIZE)) >= 0) && (((bricks[i].y * BRICKSIZE) + (parseInt(i1) * BRICKSIZE)) <= (GRID_HEIGHT))) {
                                        makeBrick(ctx, (bricks[i].x * BRICKSIZE) + (parseInt(i2) * BRICKSIZE), (tmp_lowestPos * BRICKSIZE) + (parseInt(i1) * BRICKSIZE), BRICKSIZE, BRICKSIZE, new Color(255, 255, 255, 0.2));
                                    }
                                }
                            }
                        }
                    }
                }
                for (var i1 in bricks[i].blocks) {
                    for (var i2 in bricks[i].blocks[i1]) {
                        if (bricks[i].blocks[i1][i2] == 1) {
                            if ((((bricks[i].y * BRICKSIZE) + (parseInt(i1) * BRICKSIZE)) >= 0) && (((bricks[i].y * BRICKSIZE) + (parseInt(i1) * BRICKSIZE)) <= (GRID_HEIGHT))) {
                                makeBrick(ctx, (bricks[i].x * BRICKSIZE) + (parseInt(i2) * BRICKSIZE), (bricks[i].y * BRICKSIZE) + (parseInt(i1) * BRICKSIZE), BRICKSIZE, BRICKSIZE, bricks[i].color);
                            }
                        }
                    }
                }

            }
            // NextBox field
            const BRICKSIZESCALE = 1.5;
            
            const nextBrickX = (BRICKSIZE / BRICKSIZESCALE)*2;
            const nextBrickY = (BRICKSIZE / BRICKSIZESCALE)*2;
            
            for (var i1 in bricksform[nextRandom]) {
                for (var i2 in bricksform[nextRandom][i1]) {
                    if (bricksform[nextRandom][i1][i2] == 1) {
                        makeBrick(n_ctx, nextBrickX + (parseInt(i2) * (BRICKSIZE / BRICKSIZESCALE)), nextBrickY + (parseInt(i1) * (BRICKSIZE / BRICKSIZESCALE)), BRICKSIZE / BRICKSIZESCALE, BRICKSIZE / BRICKSIZESCALE, colors[nextRandom]);
                    }
                }
            }

            // HoldingField
            h_ctx.lineWidth = 1;
            h_ctx.strokeStyle = "rgba(0,255,0,0.5)";
            h_ctx.fillStyle = "white";
            
            const holdBrickX = 0;
            const holdBrickY = 0;
            
            if (HOLDING != null) {
                for (var i1 in HOLDING.blocks) {
                    for (var i2 in HOLDING.blocks[i1]) {
                        if (HOLDING.blocks[i1][i2] == 1) {
                            makeBrick(h_ctx, holdBrickX + (parseInt(i2) * (BRICKSIZE / BRICKSIZESCALE)), holdBrickY + (parseInt(i1) * (BRICKSIZE / BRICKSIZESCALE)) , BRICKSIZE / BRICKSIZESCALE, BRICKSIZE / BRICKSIZESCALE, HOLDING.color);
                        }
                    }
                }
            }
        }

        let GAMECONTROLDOWN = false;
        const MOVESPEED = 1000;
        function gameControlDown() {
            if (GAMECONTROLDOWN == false) {
                const func = () => {
                    GAMECONTROLDOWN = true;
                    if (WHERE == 1) {
                        getMovingBrick().movedown();
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
            case 38:
            case 39:
            case 40:
            case 32:
                e.preventDefault();
                if (RUNNING) {
                    // 32 = space brick.smashdown()
                    // 37 = left brick.moveleft()
                    // 38 = up brick.rotate()
                    // 39 = right brick.moveright()
                    // 40 = down brick.movedown()
                    getMovingBrick()[Array(32).concat("smashdown", Array(4)).concat("moveleft,rotate,moveright,movedown".split(","))[e.keyCode]]();
                }
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
                    holdingShift();
                }
                break;
            }
        }
        function keyup({keyCode}) {
            if (keyCode == 32)
                MAYDROP = true;
        }
        function graphicControlLoop() {
            // CTX GRAPHICS
            requestAnimationFrame(graphicControlLoop);
            if (PENDINGUPDATE) {
                inGameGraphic(ctx);
                PENDINGUPDATE = false;
            }
        }
        this.init = function (g, h, n, sc) {
            WIDTH = 10;
            HEIGHT = 20;
            BRICKSIZE = 30;

            CANVAS_WIDTH = BRICKSIZE * WIDTH;
            CANVAS_HEIGHT = BRICKSIZE * HEIGHT;

            GRID_WIDTH = WIDTH * BRICKSIZE;
            GRID_HEIGHT = HEIGHT * BRICKSIZE;

            GRAPHIC_FONT = "Verdana";
            GRAPHIC_MENU_FONTSIZE = BRICKSIZE * 0.75;
            GRAPHIC_MENUDESC_FONTSIZE = BRICKSIZE;
            GRAPHIC_MENU_DISTANCE = GRAPHIC_MENU_FONTSIZE * 1.5;
            GRAPHIC_BOARD_FONTSIZE = BRICKSIZE - 5;
            GRAPHIC_SCORE_FONTSIZE = BRICKSIZE;
            WHERE = 1;
            RUNNING = true;
            bricks = [];
            scoreelement = sc;
            setScore(0);
            HOLDINGCOUNT = 0;
            HOLDING = null;
            bricks.push(new Brick({
                    ingame : true,
                    game : this
                }));
            gameControlDown();

            window.addEventListener("keydown", keyh, false);
            window.addEventListener("keyup", keyup, false);

            ctx = /*document.querySelector("canvas#game")*/
                g.getContext("2d");
            h_ctx = /*document.querySelector("canvas#holding")*/
                h.getContext("2d");
            n_ctx = /*document.querySelector("canvas#next")*/
                n.getContext("2d");
            clearAndResize(ctx);
            graphicControlLoop();
        }
    }

    get bricksform() {
		return this._value;
	}

    set bricksform(val) {
		this._value = val;
	}
}

export default TetrisGame