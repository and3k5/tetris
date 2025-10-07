import * as htmlLoad from "./game.html";
import DocumentUtil from "../utils/document-util";
import { RadialGradient, LinearGradient } from "./style/gradient.js";
import { drawGrid } from "./style/graphics-grid.js";
import { brick, game, utils } from "@tetris/core";
const {
    engine: { EngineBase },
} = game;
const {
    color: { Color },
} = utils;
const {
    gameController: { executeTick },
} = game;
const { Brick } = brick;

export class WebGraphicEngine extends EngineBase {
    private _brickSize = 30;

    private _gameCanvas;
    private _holdingCanvas;
    private _nextCanvas;
    private _gameCtx;
    private _holdingCtx;
    private _nextCtx;
    private _score;

    private _state = null;

    get score() {
        return this._score;
    }

    get brickSize() {
        return this._brickSize;
    }

    set brickSize(v) {
        this._brickSize = v;
    }

    get gameCanvas() {
        return this._gameCanvas;
    }

    get gameCtx() {
        return this._gameCtx;
    }

    get holdingCanvas() {
        return this._holdingCanvas;
    }

    get nextCanvas() {
        return this._nextCanvas;
    }

    constructor(options) {
        super();

        const container = new DocumentUtil(options.container).append(
            DocumentUtil.stringToElement(htmlLoad),
        );

        this._gameCanvas = container.querySelector("[data-target=gameCanvas]").el;
        this._holdingCanvas = container.querySelector("[data-target=holdingCanvas]").el;
        this._nextCanvas = container.querySelector("[data-target=nextCanvas]").el;
        this._score = container.querySelector("[data-target=score]").el;
        this._gameCtx = this._gameCanvas.getContext("2d");
        this._holdingCtx = this._holdingCanvas.getContext("2d");
        this._nextCtx = this._nextCanvas.getContext("2d");
    }

    initializeInput() {
        const game = this.game;

        this.gameCanvas.addEventListener("click", function () {
            if (game.setup.clickTick === true) executeTick(game);
        });

        window.addEventListener(
            "keydown",
            function (e) {
                switch (e.keyCode) {
                    case 37:
                        // left
                        e.preventDefault();
                        game.input.left();
                        break;
                    case 38:
                        // up
                        e.preventDefault();
                        game.input.rotate();
                        break;
                    case 39:
                        // right
                        e.preventDefault();
                        game.input.right();
                        break;
                    case 40:
                        // down
                        e.preventDefault();
                        game.input.down();
                        break;
                    case 32:
                        // space
                        e.preventDefault();
                        if (e.repeat !== true) game.input.smashDown();
                        break;
                    case 27:
                        // escape
                        e.preventDefault();
                        if (game.running) {
                            // ingame
                            game.runEvent("fx", null, "sound", "menuback");
                        }
                        break;
                    case 16:
                        // shift
                        e.preventDefault();
                        game.input.hold();
                        break;
                }
            },
            false,
        );

        let touchStart = null;

        this.gameCanvas.addEventListener("touchstart", function (event) {
            const touch = event.changedTouches[0];
            touchStart = { x: touch.screenX, y: touch.screenY };
        });
        this.gameCanvas.addEventListener("touchend", function (event) {
            const touch = event.changedTouches[0];
            const touchEnd = { x: touch.screenX, y: touch.screenY };

            const deltaX = touchEnd.x - touchStart.x;
            const deltaY = touchEnd.y - touchStart.y;
            const rad = Math.atan2(deltaY, deltaX);
            let deg = rad * (180 / Math.PI);

            while (deg < 0) deg += 360;

            if (deg > 120 && deg < 220) {
                game.input.left();
            } else if (deg > 340 || deg < 40) {
                game.input.right();
            } else if (deg < 115 && deg > 65) {
                game.input.smashDown();
            } else {
                console.debug(deg);
            }
        });
        this.holdingCanvas.addEventListener("click", function () {
            game.holdingShift();
        });
    }

    clearCanvases() {
        this.clearCanvas(this._gameCtx, this.canvasWidth, this.canvasHeight);
        this.clearCanvas(this._holdingCtx, this.brickSize * 4, this.brickSize * 4);
        this.clearCanvas(this._nextCtx, this.brickSize * 4, this.brickSize * 4);
    }

    clear() {
        this.clearState();
    }

    drawGrid() {
        const BRICKSIZESCALE = 1.5;
        drawGrid(
            this._gameCtx,
            this.game.gridColor,
            this.brickSize,
            this.brickSize,
            this.game.width,
            this.game.height,
        );
        const smallBrickSize = this.brickSize / BRICKSIZESCALE;
        drawGrid(this._nextCtx, this.game.gridColor, smallBrickSize, smallBrickSize, 6, 6);
        drawGrid(this._holdingCtx, this.game.gridColor, smallBrickSize, smallBrickSize, 6, 6);
    }

    clearState() {
        if (this._state == null) {
            this._state = {};
            this._state.bricks = {
                holding: [],
                game: [],
                next: [],
            };
        }
        this.clearArray(this._state.bricks.holding);
        const removedGameItems = this.clearArray(this._state.bricks.game);
        this.clearArray(this._state.bricks.next);
        return removedGameItems;
    }

    clearArray(array) {
        return array.splice(0, array.length);
    }

    addToState({ brick, old, state, x, y, blocks, color, scale = 1 }) {
        if (typeof old === "undefined") {
            old = state;
        }

        let entry = brick != null ? old.filter((b) => b.brick === brick)[0] : null;

        if (typeof x !== "number") {
            if (brick instanceof Brick) {
                x = brick.x;
            } else {
                throw new Error("Missing x coordinate");
            }
        }

        if (typeof y !== "number") {
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

        if (state.indexOf(entry) === -1) state.push(entry);

        entry.toX = x;
        entry.toY = y;

        if (typeof blocks === "undefined") {
            if (brick instanceof Brick) {
                blocks = brick.blocks;
            } else {
                throw new Error("Missing blocks");
            }
        }
        entry.blocks = blocks;

        if (typeof color === "undefined") {
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
        const removedGameEntries = this.clearState();
        const BRICKSIZESCALE = 1.5;

        const bricks = this.game.bricks;
        for (const i in bricks) {
            if (this.game.ghostDrawing && bricks[i].moving) {
                const ghostColor = new Color(255, 255, 255, 0.2);
                const tmp_lowestPos = bricks[i].getLowestPosition();
                //this.drawBrickForm(bricks[i].blocks, this._gameCtx, bricks[i].x, tmp_lowestPos, ghostColor)
                this.addToState({
                    state: this._state.bricks.game,
                    blocks: bricks[i].blocks,
                    x: bricks[i].x,
                    y: tmp_lowestPos,
                    color: ghostColor,
                });
            }
            //this.drawBrickForm(bricks[i].blocks, this._gameCtx, bricks[i].x, bricks[i].y, bricks[i].color);
            this.addToState({
                state: this._state.bricks.game,
                old: removedGameEntries,
                brick: bricks[i],
            });
        }

        //this.drawBrickForm(this.game.brickforms[this.game.nextRandom], this._nextCtx,2,2,this.game.colors[this.game.nextRandom],BRICKSIZESCALE);
        this.addToState({
            state: this._state.bricks.next,
            blocks: this.game.brickforms[this.game.nextRandom],
            x: 2,
            y: 2,
            color: this.game.colors[this.game.nextRandom],
            scale: BRICKSIZESCALE,
        });

        if (this.game.holding != null) {
            //this.drawBrickForm(this.game.holding.blocks, this._holdingCtx, 2, 2, this.game.holding.color, BRICKSIZESCALE);
            this.addToState({
                state: this._state.bricks.holding,
                brick: this.game.holding,
                x: 2,
                y: 2,
                scale: BRICKSIZESCALE,
            });
        }
    }

    drawStates() {
        this.drawState(this._state.bricks.holding, this._holdingCtx);
        this.drawState(this._state.bricks.game, this._gameCtx);
        this.drawState(this._state.bricks.next, this._nextCtx);
    }

    mix(min, max, percent) {
        return min * (1 - percent) + max * percent;
    }

    updateBrickState(entry) {
        if (
            // disable
            false &&
            typeof entry.fromX === "number" &&
            typeof entry.fromY === "number" &&
            typeof entry.toX === "number" &&
            typeof entry.toY === "number" &&
            typeof entry.fromStamp === "number"
        ) {
            const stamp = new Date().getTime() - entry.fromStamp;
            let percX = stamp / 100;
            if (percX > 1) percX = 1;
            let percY = stamp / 1000;
            if (percY > 1) percY = 1;
            entry.currentX = this.mix(entry.fromX, entry.toX, percX);
            entry.currentY = this.mix(entry.fromY, entry.toY, percY);
        } else {
            entry.currentX = entry.toX;
            entry.currentY = entry.toY;
        }
    }

    drawState(entries, ctx) {
        for (const entry of entries) {
            this.updateBrickState(entry);
            this.drawBrickForm(
                entry.blocks,
                ctx,
                entry.currentX,
                entry.currentY,
                entry.color,
                entry.scale,
            );
        }
    }

    drawBrickForm(brickForm, ctx, x, y, color, scale = 1) {
        for (const i1 in brickForm) {
            for (const i2 in brickForm[i1]) {
                if (brickForm[i1][i2] == 1) {
                    this.drawSquare(ctx, x + parseInt(i2), y + parseInt(i1), color, scale);
                }
            }
        }
    }

    drawSquare(ctx, bx, by, color, scale = 1) {
        const brickSize = this.brickSize / scale;

        const x = bx * brickSize;
        const y = by * brickSize;
        const w = brickSize;
        const h = brickSize;

        let fstyle = new RadialGradient(ctx, x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, 40);
        fstyle.addColor(0, color);
        fstyle.addColor(1, color.alphaScale(0.5));
        ctx.fillStyle = fstyle.compile();
        ctx.fillRect(x, y, w, h);

        fstyle = new LinearGradient(ctx, x + w / 2, y, x + w / 2, y + h);
        fstyle.addColor(0.2, color.alpha(0.5));
        fstyle.addColor(0, Color.Black().alpha(0.9));
        ctx.fillStyle = fstyle.compile();
        ctx.fillRect(x, y, w, h);

        fstyle = new LinearGradient(ctx, x, y + h / 2, x + w, y + h / 2);
        fstyle.addColor(0.3, color.scale(0.7).alpha(0));
        fstyle.addColor(0, Color.Black().alpha(0.4));
        ctx.fillStyle = fstyle.compile();
        ctx.fillRect(x, y, w, h);

        fstyle = new LinearGradient(ctx, x + w / 2, y, x + w / 2, y + h);
        fstyle.addColor(0.8, color.scale(0.1).alpha(0));
        fstyle.addColor(1, Color.Black());
        ctx.fillStyle = fstyle.compile();
        ctx.fillRect(x, y, w, h);

        fstyle = new LinearGradient(ctx, x, y + h / 2, x + w, y + h / 2);
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
        const game = this.game;
        if (force === true || game.PENDINGUPDATE) {
            this.drawBricks();
            game.PENDINGUPDATE = false;
        }
        this.clearCanvases();
        this.drawGrid();
        this.drawStates();
        if (loop === true) {
            const $this = this;
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
        const image = ctx.createImageData(w, h);

        for (let _x = 0; _x < w; _x++) {
            for (let _y = 0; _y < w; _y++) {
                const pos = (_x + ~~(_y * w)) * 4;

                const col = flame.mainImage(_x / w, _y / h);

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
