import * as htmlLoad from "./game.html";
import GraphicEngineBase from "../graphic-engine-base/graphic-engine-base.js";
import DocumentUtil from "../../document-util.js";
import * as gameGraphic from "../../graphics.js";
import Color from "../../color";
import { defaultGraphics } from "../../graphics.js";

export default class DefaultGraphicEngine extends GraphicEngineBase {
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
                    this.#legacyGraphics.drawSquare(ctx, (x * brickSize) + (parseInt(i2) * brickSize), (y * brickSize) + (parseInt(i1) * brickSize), brickSize, brickSize, color);
                }
            }
        }
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
