import * as htmlLoad from "./game.html";
import GraphicEngineBase from "../graphic-engine-base/graphic-engine-base.js";
import DocumentUtil from "../../document-util.js";
import * as gameGraphic from "../../graphics.js";
import Color from "../../color";
import { RadialGradient, LinearGradient } from "../../gradient.js"; 
import { defaultGraphics } from "../../graphics.js";

export class DefaultGraphicEngine extends GraphicEngineBase {
    #brickSize = 30;

    #gameCanvas;
    #holdingCanvas;
    #nextCanvas;
    #gameCtx;
    #holdingCtx;
    #nextCtx;
    #score;

    #legacyGraphics;

    get score() {
        return this.#score;
    }

    get brickSize() {
        return this.#brickSize;
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

        this.#legacyGraphics = defaultGraphics();
    }

    clear() {
        this.clearCanvas(this.#gameCtx, this.canvasWidth, this.canvasHeight);
        this.clearCanvas(this.#holdingCtx, this.brickSize * 4, this.brickSize * 4);
        this.clearCanvas(this.#nextCtx, this.brickSize * 4, this.brickSize * 4);
        this.drawGrid();
    }

    drawGrid() {
        const BRICKSIZESCALE = 1.5;
        gameGraphic.drawGrid(this.#gameCtx, this.game.gridColor, this.brickSize, this.brickSize, this.game.width, this.game.height);
        var smallBrickSize = this.brickSize / BRICKSIZESCALE;
        gameGraphic.drawGrid(this.#nextCtx, this.game.gridColor, smallBrickSize, smallBrickSize, 6, 6);
        gameGraphic.drawGrid(this.#holdingCtx, this.game.gridColor, smallBrickSize, smallBrickSize, 6, 6);
    }

    drawBricks() {
        const BRICKSIZESCALE = 1.5;

        var bricks = this.game.bricks;
        for (const i in bricks) {
            if (this.game.ghostDrawing && bricks[i].moving) {
                var ghostColor = new Color(255, 255, 255, 0.2);
                const tmp_lowestPos = bricks[i].getLowestPosition(bricks);
                this.drawBrickForm(bricks[i].blocks, this.#gameCtx, bricks[i].x, tmp_lowestPos, ghostColor)
            }
            this.drawBrickForm(bricks[i].blocks, this.#gameCtx, bricks[i].x, bricks[i].y, bricks[i].color);
        }

        
        this.drawBrickForm(this.game.brickforms[this.game.nextRandom], this.#nextCtx,2,2,this.game.colors[this.game.nextRandom],BRICKSIZESCALE);

        if (this.game.holding != null) {
            this.drawBrickForm(this.game.holding.blocks, this.#holdingCtx, 2, 2, this.game.holding.color, BRICKSIZESCALE);
        }
    }

    drawBrickForm(brickForm, ctx, x, y, color, scale = 1) {
        var brickSize = this.brickSize / scale;

        for (var i1 in brickForm) {
            for (var i2 in brickForm[i1]) {
                if (brickForm[i1][i2] == 1) {
                    this.drawSquare(ctx, (x * brickSize) + (parseInt(i2) * brickSize), (y * brickSize) + (parseInt(i1) * brickSize), brickSize, brickSize, color);
                }
            }
        }
    }

    drawSquare(ctx, x, y, w, h, color) {
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


}
