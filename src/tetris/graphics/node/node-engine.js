import GraphicEngineBase from "../graphic-engine-base/graphic-engine-base.js";
import Brick from "../../brick.js";
import Color from "../../color.js";
import readline from "readline";

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

    log() {
        console.log(this.codes.join("")+"%s"+TermUtil.Reset,this.text);
        return this;
    }

    write() {
        process.stdout.write(this.codes.join("")+this.text+TermUtil.Reset);
    }

    static write(txt) {
        return new TermUtil(txt);
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
}

export class NodeGraphicEngine extends GraphicEngineBase {
    initRender() {
        // TODO something
        console.log("init render called");

        this.render(true,true);
        this.game.addEvent("update-score",(score) => {
            this.score.innerHTML = score;
        });
    }

    render(force = false,loop = false) {
        // CTX GRAPHICS
        var game = this.game;
        if (force === true || game.PENDINGUPDATE) {
            this.drawBricks();
            game.PENDINGUPDATE = false;
        }
        
        if (loop === true)
        {
            var $this = this;
            setTimeout(() => $this.render(false, loop),10);
        }
    }

    drawBricks() {
        var bricks = this.game.bricks;

        var display = [];
        for (var i = 0;i<this.game.height;i++) {
            display[i] = [];
            for (var j = 0;j<this.game.width;j++) {
                display[i][j] = {
                    state: false,
                    color: null,
                }
            }
        }

        for (const i in bricks) {
            if (this.game.ghostDrawing && bricks[i].moving) {
                var ghostColor = new Color(255, 255, 255, 0.2);
                const tmp_lowestPos = bricks[i].getLowestPosition(bricks);
                this.setDisplay(display, bricks[i].blocks, ghostColor, bricks[i].x, tmp_lowestPos);
            }
            this.setDisplay(display,bricks[i]);
        }

        var border = "-".repeat(display[0].length+2);

        var eol = require("os").EOL;

        //if (this.rendered === true)
        process.stdout.write(String.fromCharCode(27,91,50,74));
        readline.cursorTo(process.stdout,0,0);

        //process.stdout.write(border+eol);
        TermUtil.write(border+eol).set(TermUtil.FgGreen,TermUtil.Bright).write();

        for (var row of display) {
            TermUtil.write("|").set(TermUtil.FgGreen,TermUtil.Bright).write()
            for (var cell of row) {
                if (cell.state === true) {
                    process.stdout.write("X");
                }else{
                    process.stdout.write(" ");
                }
            }
            TermUtil.write("|"+eol).set(TermUtil.FgGreen,TermUtil.Bright).write()
        }

        TermUtil.write(border+eol).set(TermUtil.FgGreen,TermUtil.Bright).write();
    }

    setDisplay(display, brick, color, x, y) {
        x = x || brick.x;
        y = y || brick.y;
        color = color || brick.color;
        var blocks = brick instanceof Brick ? brick.blocks : brick;

        this.drawBrickForm(blocks,display, x, y, color);
    }

    drawBrickForm(brickForm, display, x, y, color) {
        for (var i1 in brickForm) {
            for (var i2 in brickForm[i1]) {
                if (brickForm[i1][i2] == 1) {
                    var _x = (x) + (parseInt(i2));
                    var _y = (y) + (parseInt(i1));
                    
                    if (_y < 0)
                        continue;

                    var row = display[_y];
                    if (row == undefined) 
                        throw new Error("Row not found: "+_y);

                    row[_x].state = true;
                    row[_x].color = color;
                }
            }
        }
    }

    initializeInput() {
        //const readline = require("readline");
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);

        var game = this.game;

        process.stdin.on("keypress", (str,key) => {
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
                            playSound("menuback");
                        }
                        break;
                    case "tab":
                        // shift
                        if (game.running) {
                            game.holdingShift();
                        }
                        break;
                }

            console.log("keypress: "+key.name);
        });
    }
}
