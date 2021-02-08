import * as htmlLoad from "./game.html";
import DocumentUtil from "../utils/document-util";
import { RadialGradient, LinearGradient } from "./style/gradient.js";
import { drawGrid } from "./style/graphics-grid.js";
import { brick, game, utils } from "@tetris/core";
const { engine: { EngineBase } } = game;
const { color: { Color } } = utils;
const { gameController: { executeTick } } = game;
const { Brick } = brick;

export class WebGraphicEngine extends EngineBase {
    #brickSize = 30;

    #gameCanvas;
    #holdingCanvas;
    #nextCanvas;
    #gameCtx;
    #holdingCtx;
    #nextCtx;
    #score;

    #state = null;

    get score() {
        return this.#score;
    }

    get brickSize() {
        return this.#brickSize;
    }

    set brickSize(v) {
        this.#brickSize = v;
    }

    get gameCanvas() {
        return this.#gameCanvas;
    }

    get gameCtx() {
        return this.#gameCtx;
    }

    get holdingCanvas() {
        return this.#holdingCanvas;
    }

    get nextCanvas() {
        return this.#nextCanvas;
    }

    constructor(options) {
        super();

        var container =
            new DocumentUtil(options.container)
                .append(DocumentUtil.stringToElement(htmlLoad));

        this.#gameCanvas = container.querySelector("[data-target=gameCanvas]").el;
        this.#holdingCanvas = container.querySelector("[data-target=holdingCanvas]").el;
        this.#nextCanvas = container.querySelector("[data-target=nextCanvas]").el;
        this.#score = container.querySelector("[data-target=score]").el;
        this.#gameCtx = this.#gameCanvas.getContext("2d");
        this.#holdingCtx = this.#holdingCanvas.getContext("2d");
        this.#nextCtx = this.#nextCanvas.getContext("2d");
    }

    initializeInput() {
        var game = this.game;

        this.gameCanvas.addEventListener("click", function () {
            if (game.setup.clickTick === true)
                executeTick(game);
        });

        window.addEventListener("keydown", function (e) {
            switch (e.keyCode) {
                case 37:
                    // left
                    e.preventDefault();
                    if (game.running)
                        game.action_moveleft();
                    break;
                case 38:
                    // up
                    e.preventDefault();
                    if (game.running)
                        game.action_rotate();
                    break;
                case 39:
                    // right
                    e.preventDefault();
                    if (game.running)
                        game.action_moveright();
                    break;
                case 40:
                    // down
                    e.preventDefault();
                    if (game.running)
                        game.action_movedown();
                    break;
                case 32:
                    // space
                    e.preventDefault();
                    if (game.running && e.repeat !== true)
                        game.action_smashdown();
                    break;
                case 27:
                    // escape
                    e.preventDefault();
                    if (game.running) {
                        // ingame
                        menuNav("paused");
                        game.runEvent("fx", null, "sound", "menuback");
                    }
                    break;
                case 16:
                    // shift
                    e.preventDefault();
                    if (game.running) {
                        game.holdingShift();
                    }
                    break;
            }
        }, false);

        var touchStart = null;

        this.gameCanvas.addEventListener("touchstart", function (event) {
            var touch = event.changedTouches[0];
            touchStart = { x: touch.screenX, y: touch.screenY };
        });
        this.gameCanvas.addEventListener("touchend", function (event) {
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
        this.holdingCanvas.addEventListener("click", function () {
            game.holdingShift();
        });
    }

    clearCanvases() {
        this.clearCanvas(this.#gameCtx, this.canvasWidth, this.canvasHeight);
        this.clearCanvas(this.#holdingCtx, this.brickSize * 4, this.brickSize * 4);
        this.clearCanvas(this.#nextCtx, this.brickSize * 4, this.brickSize * 4);
    }

    clear() {
        this.clearState();
    }

    drawGrid() {
        const BRICKSIZESCALE = 1.5;
        drawGrid(this.#gameCtx, this.game.gridColor, this.brickSize, this.brickSize, this.game.width, this.game.height);
        var smallBrickSize = this.brickSize / BRICKSIZESCALE;
        drawGrid(this.#nextCtx, this.game.gridColor, smallBrickSize, smallBrickSize, 6, 6);
        drawGrid(this.#holdingCtx, this.game.gridColor, smallBrickSize, smallBrickSize, 6, 6);
    }

    clearState() {
        if (this.#state == null) {
            this.#state = {};
            this.#state.bricks = {
                holding: [],
                game: [],
                next: [],
            };
        }
        this.clearArray(this.#state.bricks.holding);
        var removedGameItems = this.clearArray(this.#state.bricks.game);
        this.clearArray(this.#state.bricks.next);
        return removedGameItems;
    }

    clearArray(array) {
        return array.splice(0, array.length);
    }

    addToState({ brick, old, state, x, y, blocks, color, scale = 1 }) {
        if (typeof (old) === "undefined") {
            old = state;
        }

        var entry = brick != null ? old.filter(b => b.brick === brick)[0] : null;

        if (typeof (x) !== "number") {
            if (brick instanceof Brick) {
                x = brick.x;
            } else {
                throw new Error("Missing x coordinate");
            }
        }

        if (typeof (y) !== "number") {
            if (brick instanceof Brick) {
                y = brick.y;
            } else {
                throw new Error("Missing x coordinate");
            }
        }

        if (entry == null) {
            entry = { brick };
            entry.fromX = x;
            entry.fromY = y;
        } else {
            entry.fromX = entry.currentX;
            entry.fromY = entry.currentY;
        }

        if (state.indexOf(entry) === -1)
            state.push(entry);

        entry.toX = x;
        entry.toY = y;

        if (typeof (blocks) === "undefined") {
            if (brick instanceof Brick) {
                blocks = brick.blocks;
            } else {
                throw new Error("Missing blocks");
            }
        }
        entry.blocks = blocks;

        if (typeof (color) === "undefined") {
            if (brick instanceof Brick) {
                color = brick.color;
            } else {
                throw new Error("Missing color");
            }
        }
        entry.color = color;

        entry.scale = scale;
        entry.fromStamp = new Date().getTime();
    }

    drawBricks() {
        var removedGameEntries = this.clearState();
        const BRICKSIZESCALE = 1.5;

        var bricks = this.game.bricks;
        for (const i in bricks) {
            if (this.game.ghostDrawing && bricks[i].moving) {
                var ghostColor = new Color(255, 255, 255, 0.2);
                const tmp_lowestPos = bricks[i].getLowestPosition();
                //this.drawBrickForm(bricks[i].blocks, this.#gameCtx, bricks[i].x, tmp_lowestPos, ghostColor)
                this.addToState({
                    state: this.#state.bricks.game,
                    blocks: bricks[i].blocks,
                    x: bricks[i].x,
                    y: tmp_lowestPos,
                    color: ghostColor
                });
            }
            //this.drawBrickForm(bricks[i].blocks, this.#gameCtx, bricks[i].x, bricks[i].y, bricks[i].color);
            this.addToState({ state: this.#state.bricks.game, old: removedGameEntries, brick: bricks[i] });
        }


        //this.drawBrickForm(this.game.brickforms[this.game.nextRandom], this.#nextCtx,2,2,this.game.colors[this.game.nextRandom],BRICKSIZESCALE);
        this.addToState({
            state: this.#state.bricks.next,
            blocks: this.game.brickforms[this.game.nextRandom],
            x: 2,
            y: 2,
            color: this.game.colors[this.game.nextRandom],
            scale: BRICKSIZESCALE
        });

        if (this.game.holding != null) {
            //this.drawBrickForm(this.game.holding.blocks, this.#holdingCtx, 2, 2, this.game.holding.color, BRICKSIZESCALE);
            this.addToState({
                state: this.#state.bricks.holding,
                brick: this.game.holding,
                x: 2,
                y: 2,
                scale: BRICKSIZESCALE
            });
        }
    }

    drawStates() {
        this.drawState(this.#state.bricks.holding, this.#holdingCtx);
        this.drawState(this.#state.bricks.game, this.#gameCtx);
        this.drawState(this.#state.bricks.next, this.#nextCtx);
    }

    mix(min, max, percent) {
        return min * (1 - percent) + max * percent;
    }

    updateBrickState(entry) {
        if (
            // disable
            false &&
            typeof (entry.fromX) === "number" && typeof (entry.fromY) === "number" &&
            typeof (entry.toX) === "number" && typeof (entry.toY) === "number" &&
            typeof (entry.fromStamp) === "number"
        ) {
            var stamp = new Date().getTime() - entry.fromStamp;
            var percX = (stamp / 100);
            if (percX > 1) percX = 1;
            var percY = (stamp / 1000);
            if (percY > 1) percY = 1;
            entry.currentX = this.mix(entry.fromX, entry.toX, percX);
            entry.currentY = this.mix(entry.fromY, entry.toY, percY);
        } else {
            entry.currentX = entry.toX;
            entry.currentY = entry.toY;
        }
    }

    drawState(entries, ctx) {
        for (var entry of entries) {
            this.updateBrickState(entry);
            this.drawBrickForm(entry.blocks, ctx, entry.currentX, entry.currentY, entry.color, entry.scale);
        }
    }



    drawBrickForm(brickForm, ctx, x, y, color, scale = 1) {
        for (var i1 in brickForm) {
            for (var i2 in brickForm[i1]) {
                if (brickForm[i1][i2] == 1) {
                    this.drawSquare(ctx, (x) + (parseInt(i2)), (y) + (parseInt(i1)), color, scale);
                }
            }
        }
    }

    drawSquare(ctx, bx, by, color, scale = 1) {
        var brickSize = this.brickSize / scale;

        var x = (bx * brickSize);
        var y = (by * brickSize);
        var w = brickSize;
        var h = brickSize;

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

    clearCanvas(ctx, w, h) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.canvas.width = w;
        ctx.canvas.height = h;
    }

    get canvasWidth() {
        return this.brickSize * this.game.width;
    }

    get canvasHeight() {
        return this.brickSize * this.game.height;
    }

    initRender() {
        this.render(true, true);
        this.game.addEvent("update-score", (score) => {
            this.score.innerHTML = score;
        });
    }

    render(force = false, loop = false) {
        // CTX GRAPHICS
        var game = this.game;
        if (force === true || game.PENDINGUPDATE) {
            this.drawBricks();
            game.PENDINGUPDATE = false;
        }
        this.clearCanvases();
        this.drawGrid();
        this.drawStates();
        if (loop === true) {
            var $this = this;
            requestAnimationFrame(() => $this.render(false, loop));
        }
    }
}

import * as flame from "./style/flame.js";

export class BurningGraphicEngine extends WebGraphicEngine {
    constructor(options) {
        super(options);
        //this.brickSize = 190;
    }

    drawSquare(ctx, x, y, w, h, color) {
        var image = ctx.createImageData(w, h);



        for (var _x = 0; _x < w; _x++) {
            for (var _y = 0; _y < w; _y++) {
                var pos = (_x + ~~(_y * w)) * 4;

                var col = flame.mainImage(_x / w, _y / h);

                if (window.loq != true) {
                    window.loq = true;
                }


                image.data[pos + 0] = col[0] * 255;
                image.data[pos + 1] = col[1] * 255;
                image.data[pos + 2] = col[2] * 255;
                image.data[pos + 3] = 255;
            }
        }



        ctx.putImageData(image, x, y);
    }
}