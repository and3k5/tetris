import * as htmlLoad from "./game.html";
import GraphicEngineBase from "../graphic-engine-base/graphic-engine-base.js";
import DocumentUtil from "../../document-util.js";
import Color from "../../color";
import { RadialGradient, LinearGradient } from "../../gradient.js"; 
import { drawGrid } from "../../graphics-grid.js";

export class WebGraphicEngine extends GraphicEngineBase {
    #brickSize = 30;

    #gameCanvas;
    #holdingCanvas;
    #nextCanvas;
    #gameCtx;
    #holdingCtx;
    #nextCtx;
    #score;

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

        window.addEventListener("keydown", function (e) {
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

    clear() {
        this.clearCanvas(this.#gameCtx, this.canvasWidth, this.canvasHeight);
        this.clearCanvas(this.#holdingCtx, this.brickSize * 4, this.brickSize * 4);
        this.clearCanvas(this.#nextCtx, this.brickSize * 4, this.brickSize * 4);
        this.drawGrid();
    }

    drawGrid() {
        const BRICKSIZESCALE = 1.5;
        drawGrid(this.#gameCtx, this.game.gridColor, this.brickSize, this.brickSize, this.game.width, this.game.height);
        var smallBrickSize = this.brickSize / BRICKSIZESCALE;
        drawGrid(this.#nextCtx, this.game.gridColor, smallBrickSize, smallBrickSize, 6, 6);
        drawGrid(this.#holdingCtx, this.game.gridColor, smallBrickSize, smallBrickSize, 6, 6);
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
        var y = (by *  brickSize);
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
        this.render(true,true);
    }

    render(force = false,loop = false) {
        // CTX GRAPHICS
        var game = this.game;
        if (force === true || game.PENDINGUPDATE) {
            this.clear();
            this.drawBricks();
            game.PENDINGUPDATE = false;
        }
        if (loop === true)
        {
            var $this = this;
            requestAnimationFrame(() => $this.render(false, loop));
        }
    }
}

import * as flame from "../../flame.js";

export class BurningGraphicEngine extends WebGraphicEngine {
    constructor(options) {
        super(options);
        //this.brickSize = 190;
    }

    drawSquare(ctx, x, y, w, h, color) {
        var image = ctx.createImageData(w,h);
        
        

        for (var _x = 0;_x<w;_x++) {
            for (var _y = 0;_y<w;_y++) {
                var pos = (_x + ~~(_y * w)) * 4;

                var col = flame.mainImage(_x/w,_y/h);

                if (window.loq != true) {
                    console.log(col)
                    window.loq = true;
                }
                    

                image.data[pos+0] = col[0] * 255;
                image.data[pos+1] = col[1] * 255;
                image.data[pos+2] = col[2] * 255;
                image.data[pos+3] = 255;
            }
        }



        ctx.putImageData(image,x,y);
    }
}