import { Brick } from "@tetris/core/brick";
import { Blocks } from "@tetris/core/brick/brick";
import { EngineBase } from "@tetris/core/game/engine";
import { Color } from "@tetris/core/utils/color";
import { StateValue } from "./StateValue";
import { RadialGradient, LinearGradient } from "./style/gradient";
import { drawGrid } from "./style/graphics-grid";

export class WebGraphicEngine extends EngineBase {
    private _brickSize = 30;

    private _gameCtx;
    private _holdingCtx;
    private _nextCtx;
    private _score;

    private _state: {
        bricks: {
            holding: StateValue[];
            game: StateValue[];
            next: StateValue[];
        };
    } | null = null;

    get score() {
        return this._score;
    }

    get brickSize() {
        return this._brickSize;
    }

    set brickSize(v) {
        this._brickSize = v;
    }

    get gameCtx() {
        return this._gameCtx;
    }

    constructor({
        gameOffscreenCanvas,
        holdingOffscreenCanvas,
        nextOffscreenCanvas,
    }: {
        gameOffscreenCanvas: OffscreenCanvas;
        holdingOffscreenCanvas: OffscreenCanvas;
        nextOffscreenCanvas: OffscreenCanvas;
    }) {
        super();

        this._gameCtx = gameOffscreenCanvas.getContext("2d");
        this._holdingCtx = holdingOffscreenCanvas.getContext("2d");
        this._nextCtx = nextOffscreenCanvas.getContext("2d");
    }

    initializeInput() {
        postMessage({ type: "init-input" });
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
            this._state = {
                bricks: {
                    holding: [],
                    game: [],
                    next: [],
                },
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

    addToState({
        brick,
        old,
        state,
        x,
        y,
        blocks,
        color,
        scale = 1,
    }: {
        brick?: Brick | undefined;
        old?: StateValue[] | undefined;
        state: StateValue[];
        x?: number | undefined;
        y?: number | undefined;
        blocks?: Blocks | undefined;
        color?: Color | undefined;
        scale?: number | undefined;
    }) {
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

        if (typeof blocks === "undefined") {
            if (brick instanceof Brick) {
                blocks = brick.blocks;
            } else {
                throw new Error("Missing blocks");
            }
        }
        if (typeof color === "undefined") {
            if (brick instanceof Brick) {
                color = brick.color;
            } else {
                throw new Error("Missing color");
            }
        }

        if (entry == null) {
            entry = {
                brick,
                fromX: x,
                fromY: y,
                toX: x,
                toY: y,
                blocks,
                color,
                scale,
                fromStamp: new Date().getTime(),
            };
        } else {
            entry.fromX = entry.currentX;
            entry.fromY = entry.currentY;
            entry.toX = x;
            entry.toY = y;
            entry.blocks = blocks;
            entry.color = color;
            entry.scale = scale;
            entry.fromStamp = new Date().getTime();
        }

        if (state.indexOf(entry) === -1) state.push(entry);
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

    updateBrickState(entry: StateValue) {
        // if (
        //     // disable
        //     false &&
        //     typeof entry.fromX === "number" &&
        //     typeof entry.fromY === "number" &&
        //     typeof entry.toX === "number" &&
        //     typeof entry.toY === "number" &&
        //     typeof entry.fromStamp === "number"
        // ) {
        // } else {
        entry.currentX = entry.toX;
        entry.currentY = entry.toY;
        // }
    }

    drawState(entries: StateValue[], ctx: CanvasRenderingContext2D) {
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

    drawBrickForm(
        brickForm: Blocks,
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        color: Color,
        scale = 1,
    ) {
        for (const i1 in brickForm) {
            for (const i2 in brickForm[i1]) {
                if (brickForm[i1][i2] === true) {
                    this.drawSquare(ctx, x + parseInt(i2), y + parseInt(i1), color, scale);
                }
            }
        }
    }

    drawSquare(ctx: CanvasRenderingContext2D, bx: number, by: number, color: Color, scale = 1) {
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
            postMessage({ type: "update-score", score });
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
            requestAnimationFrame(() => this.render(false, loop));
        }
    }
}
