import { brick, utils, game } from "@tetris/core";
const { engine : { EngineBase }} = game;
const { Brick } = brick;
const { color } = utils;
const { Color } = color;
import readline from "readline";
import size from "window-size";
const { trace: console } = utils;

class TermWriter {
    constructor() {
        this.items = [];
    }

    addNew(txt = "") {
        var item = new TermUtil(txt);
        this.items.push(item);
        return item;
    }

    getString() {
        return this.items.map(x => x.getString()).join("");
    }

    write() {
        process.stdout.write(this.getString());
    }
}

class TermUtil {

    constructor(text) {
        this.codes = [];
        this.text = text;
    }

    set(...codes) {
        for (var code of codes)
            this.codes.push(code);
        return this;
    }

    text(text) {
        this.text = text;
        return this;
    }

    log() {
        console.log(this.codes.join("") + "%s" + TermUtil.Reset, this.text);
        return this;
    }

    getString() {
        return this.codes.join("") + this.text + TermUtil.Reset;
    }

    write() {
        process.stdout.write(this.getString());
    }

    static write(txt) {
        return new TermUtil(txt);
    }

    static get Clear() {
        return String.fromCharCode(27, 91, 50, 74);
    }

    static get Reset() {
        return "\x1b[0m";
    }
    static get Bright() {
        return "\x1b[1m";
    }
    static get Dim() {
        return "\x1b[2m";
    }
    static get Underscore() {
        return "\x1b[4m";
    }
    static get Blink() {
        return "\x1b[5m";
    }
    static get Reverse() {
        return "\x1b[7m";
    }
    static get Hidden() {
        return "\x1b[8m";
    }

    static get FgBlack() {
        return "\x1b[30m";
    }
    static get FgRed() {
        return "\x1b[31m";
    }
    static get FgGreen() {
        return "\x1b[32m";
    }
    static get FgYellow() {
        return "\x1b[33m";
    }
    static get FgBlue() {
        return "\x1b[34m";
    }
    static get FgMagenta() {
        return "\x1b[35m";
    }
    static get FgCyan() {
        return "\x1b[36m";
    }
    static get FgWhite() {
        return "\x1b[37m";
    }

    static get BgBlack() {
        return "\x1b[40m";
    }
    static get BgRed() {
        return "\x1b[41m";
    }
    static get BgGreen() {
        return "\x1b[42m";
    }
    static get BgYellow() {
        return "\x1b[43m";
    }
    static get BgBlue() {
        return "\x1b[44m";
    }
    static get BgMagenta() {
        return "\x1b[45m";
    }
    static get BgCyan() {
        return "\x1b[46m";
    }
    static get BgWhite() {
        return "\x1b[47m";
    }

    static get TwoLineFrame() {
        return {
            topLeft: "╔",
            topRight: "╗",
            bottomLeft: "╚",
            bottomRight: "╝",
            vertical: "║",
            horizontal: "═",
        };
    }

    static get SingleLineFrame() {
        return {
            topLeft: "┏",
            topRight: "┓",
            bottomLeft: "┗",
            bottomRight: "┛",
            vertical: "┃",
            horizontal: "━",
        };
    }
}

export class NodeGraphicEngine extends EngineBase {
    initRender() {
        // TODO something
        console.log("init render called");

        this.render(true, true);
        this.game.addEvent("update-score", (score) => {
            //this.score.innerHTML = score;
        });
    }

    render(force = false, loop = false) {
        // CTX GRAPHICS
        var game = this.game;
        if (force === true || game.PENDINGUPDATE) {
            this.drawBricks();
            game.PENDINGUPDATE = false;
        }

        if (loop === true) {
            var $this = this;
            setTimeout(() => $this.render(false, loop), 10);
        }
    }

    createDisplay(w, h) {
        var display = [];
        for (var i = 0; i < h; i++) {
            display[i] = [];
            for (var j = 0; j < w; j++) {
                display[i][j] = {
                    state: false,
                    color: null,
                }
            }
        }
        return display;
    }

    drawBricks() {
        var bricks = this.game.bricks;

        var display = this.createDisplay(this.game.width, this.game.height);

        for (const i in bricks) {
            if (this.game.ghostDrawing && bricks[i].moving) {
                var ghostColor = new Color(255, 255, 255, 0.2);
                const tmp_lowestPos = bricks[i].getLowestPosition();
                this.setDisplay(display, bricks[i].blocks, ghostColor, bricks[i].x, tmp_lowestPos);
            }
            this.setDisplay(display, bricks[i]);
        }

        var holdingDisplay = this.createDisplay(6, 6);

        if (this.game.holding != null) {
            this.setDisplay(holdingDisplay, this.game.holding, this.game.holding.color, 2, 2);
        }

        var nextDisplay = this.createDisplay(6, 6);
        this.setDisplay(nextDisplay, this.game.brickforms[this.game.nextRandom], this.game.colors[this.game.nextRandom], 2, 2);


        this.drawDisplay(display, holdingDisplay, nextDisplay);
    }

    writeDisplayCell(output, cell) {
        if (cell.state === true) {
            output.addNew("  ").set(this.getMatchingBg(cell.color));
        } else {
            output.addNew("  ");
        }
    }

    drawDisplay(display, holdingDisplay, nextDisplay) {
        var gameWidth = display[0].length * 2 + 2;

        var offset = parseInt(size.width / 2 - gameWidth / 2);

        var eol = require("os").EOL;

        //if (this.rendered === true)

        var output = new TermWriter();

        var theme = TermUtil.SingleLineFrame;

        var holdingOffset = offset - holdingDisplay[0].length * 2 - 2;

        //process.stdout.write(border+eol);
        output.addNew(" ".repeat(holdingOffset - 2));
        output.addNew(theme.topLeft + theme.horizontal.repeat(holdingDisplay[0].length * 2) + theme.topRight).set(TermUtil.FgGreen, TermUtil.Bright);
        output.addNew(" ".repeat(2));
        output.addNew(theme.topLeft + theme.horizontal.repeat(gameWidth - 2) + theme.topRight).set(TermUtil.FgGreen, TermUtil.Bright);
        output.addNew(" ".repeat(2));
        output.addNew(theme.topLeft + theme.horizontal.repeat(nextDisplay[0].length * 2) + theme.topRight + eol).set(TermUtil.FgGreen, TermUtil.Bright);

        for (var row of display) {
            var y = display.indexOf(row);

            var tempOffset = offset;

            if (y < holdingDisplay.length) {
                var holdingWidth = holdingDisplay[y].length * 2;
                output.addNew(" ".repeat(holdingOffset - 2));
                output.addNew(theme.vertical).set(TermUtil.FgGreen, TermUtil.Bright);
                for (var hCell of holdingDisplay[y]) {
                    this.writeDisplayCell(output, hCell);
                }
                output.addNew(theme.vertical).set(TermUtil.FgGreen, TermUtil.Bright);
                tempOffset -= holdingWidth;
                output.addNew(" ".repeat(2));
            } else if (y === holdingDisplay.length) {
                output.addNew(" ".repeat(holdingOffset - 2));
                output.addNew(theme.bottomLeft + theme.horizontal.repeat(holdingDisplay[0].length * 2) + theme.bottomRight).set(TermUtil.FgGreen, TermUtil.Bright);
                output.addNew(" ".repeat(2));
            } else {
                output.addNew(" ".repeat(tempOffset));
            }


            output.addNew(theme.vertical).set(TermUtil.FgGreen, TermUtil.Bright);
            for (var cell of row) {
                this.writeDisplayCell(output, cell);
            }
            output.addNew(theme.vertical).set(TermUtil.FgGreen, TermUtil.Bright);

            if (y < nextDisplay.length) {
                output.addNew(" ".repeat(2));
                output.addNew(theme.vertical).set(TermUtil.FgGreen, TermUtil.Bright);
                for (var nCell of nextDisplay[y]) {
                    this.writeDisplayCell(output, nCell);
                }
                output.addNew(theme.vertical).set(TermUtil.FgGreen, TermUtil.Bright);
            } else if (y === nextDisplay.length) {
                output.addNew(" ".repeat(2));
                output.addNew(theme.bottomLeft + theme.horizontal.repeat(nextDisplay[0].length * 2) + theme.bottomRight).set(TermUtil.FgGreen, TermUtil.Bright);
            } else {
                output.addNew(" ".repeat(tempOffset));
            }

            output.addNew(eol);
        }

        output.addNew(" ".repeat(offset));
        output.addNew(theme.bottomLeft + theme.horizontal.repeat(gameWidth - 2) + theme.bottomRight + eol).set(TermUtil.FgGreen, TermUtil.Bright);

        process.stdout.write(TermUtil.Clear);
        readline.cursorTo(process.stdout, 0, 0);
        output.write();
    }

    getMatchingFg(color) {
        return TermUtil["Fg" + this.getMatchingTerminalColorName(color)];
    }

    getMatchingBg(color) {
        return TermUtil["Bg" + this.getMatchingTerminalColorName(color)];
    }

    getMatchingTerminalColorName(color) {

        var hsla = color.toHSLA();

        //console.log(hsla);

        var h = hsla.h % 360;
        while (h < 0)
            h += 360;



        if (hsla.l > 0.7)
            return "White";

        //TermUtil.FgBlack
        if (h > 210 && h <= 240)
            return "Blue";
        if (h > 140 && h <= 210)
            return "Cyan";
        if (h > 100 && h <= 140)
            return "Green";
        if (h > 240 && h <= 330)
            return "Magenta";
        if (h > 330 || h <= 30)
            return "Red";
        if (h > 30 && h <= 100)
            return "Yellow";

        return "White";
    }

    setDisplay(display, brick, color, x, y) {
        if (typeof (x) !== "number")
            x = brick.x;
        if (typeof (y) !== "number")
            y = brick.y;
        if (color == null)
            color = brick.color;
        var blocks = brick instanceof Brick ? brick.blocks : brick;

        this.drawBrickForm(blocks, display, x, y, color);
    }

    drawBrickForm(brickForm, display, x, y, color) {
        if (typeof (x) !== "number")
            throw new Error("x is not number: " + x);
        if (typeof (y) !== "number")
            throw new Error("y is not number: " + x);
        for (var i1 in brickForm) {
            for (var i2 in brickForm[i1]) {
                if (brickForm[i1][i2] == 1) {
                    var _x = (x) + (parseInt(i2));
                    var _y = (y) + (parseInt(i1));

                    if (_y < 0)
                        continue;

                    if (_x < 0)
                        continue;

                    if (isNaN(_y))
                        throw new Error("Y parsed as NaN: " + y + " + " + i1);

                    if (isNaN(_x))
                        throw new Error("X parsed as NaN: " + x + " + " + i2);

                    var row = display[_y];
                    if (row == undefined)
                        throw new Error("Row not found: " + _y);

                    var cell = row[_x];

                    if (cell == undefined)
                        throw new Error("Cell not found: " + _x);

                    cell.state = true;
                    cell.color = color;
                }
            }
        }
    }

    initializeInput() {
        //const readline = require("readline");
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);

        var game = this.game;

        process.stdin.on("keypress", (str, key) => {
            if (key.ctrl && key.name === "c")
                return process.exit(0);

            switch (key.name) {
                case "left":
                case "a":
                    // left
                    if (game.running)
                        game.action_moveleft();
                    break;
                case "up":
                case "w":
                    // up
                    if (game.running)
                        game.action_rotate();
                    break;
                case "right":
                case "d":
                    // right
                    if (game.running)
                        game.action_moveright();
                    break;
                case "down":
                case "s":
                    // down
                    if (game.running)
                        game.action_movedown();
                    break;
                case "space":
                    // space
                    if (game.running)
                        game.action_smashdown();
                    break;
                case "escape":
                    // escape
                    if (game.running) {
                        // ingame
                        menuNav("paused");

                        game.runEvent("fx", null, "sound", "menuback");
                    }
                    break;
                case "tab":
                    // shift
                    if (game.running) {
                        game.holdingShift();
                    }
                    break;
            }

            console.log("keypress: " + key.name);
        });
    }
}
