import { playSound } from "./sound.js";
import * as console from "../utils/trace.js";
import {createUniqueGuid} from "../utils/guid.js";

class Brick {
    #x = undefined;
    #y = undefined;
    #rotation = 0;
    #index = undefined;
    #guid;
    constructor(options) {
        const o = options || { 'ingame': false, 'game': null };
        if (typeof (o.guid) === "string")
            this.#guid = o.guid;
        else
            this.#guid = createUniqueGuid();

        this.game = o.game;
        this.ingame = o.ingame;

        if (o.brickform != null) {
            if (this.game != null)
                this.color = this.game.getColors()[0].copy();
            this.blocks = o.brickform.concat();
        }

        if (typeof (o.x) === "number" && typeof (o.y) === "number") {
            this.x = o.x;
            this.y = o.y;
        }
    }

    get guid() {
        return this.#guid;
    }

    get index() {
        return this.#index;
    }

    set index(v) {
        this.#index = v;
    }

    clone() {
        var brick = new Brick({guid: this.#guid});
        
        brick.#x = this.#x;
        brick.#y = this.#y;
        brick.moving = this.moving;
        brick.blocks = this.blocks.concat();
        brick.color = this.color.copy();
        brick.#rotation = this.#rotation;
        brick.index = this.index;
        return brick;
    }

    get x() {
        return this.#x;
    }

    set x(v) {
        this.#x = v;
        this.requestUpdate();
    }

    get y() {
        return this.#y;
    }

    set y(v) {
        this.#y = v;
        this.requestUpdate();
    }

    get containerWidth() {
        return this.blocks[0].length;
    }

    get containerHeight() {
        return this.blocks.length;
    }

    requestUpdate() {
        if (this.ingame && (this.game != null)) {
            this.game.PENDINGUPDATE = true;
        }
    }

    resetPosition() {
        this.x = Math.round(((this.game.width) / 2) - (this.blocks[0].length / 2));
        this.y = Math.round(0 - (this.blocks.length));
    }

    getAbsoluteBlocks(blocks = null, x = 0, y = 0) {
        if (blocks == null)
            blocks = this.blocks;
        return Brick.calcAbsoluteBlocks(blocks,this.x,this.y,x,y);
    }

    // todo make static
    static calcAbsoluteBlocks(blocks, px, py, x = 0, y = 0) {
        var result = [];

        var offsetX = px + x;
        var offsetY = py + y;

        for (const i1 in blocks) {
            for (const i2 in blocks[i1]) {
                if (blocks[i1][i2] == 1) {
                    result.push({ x: offsetX + parseInt(i2), y: offsetY + parseInt(i1) });
                }
            }
        }

        return result;
    }

    checkCollision(x, y, brcks) {
        for (const i in brcks) {
            for (const i1 in brcks[i].blocks) {
                for (const i2 in brcks[i].blocks[i1]) {
                    if (brcks[i].blocks[i1][i2] == 1) {
                        const cond1 = (x == brcks[i].x + parseInt(i2));
                        const cond2 = (y == brcks[i].y + parseInt(i1));
                        const cond3 = (this != brcks[i]);
                        if (cond1 && cond2 && cond3) {
                            return false;
                        } else { }
                    }
                }
            }
        }
        return true;
    }

    getHeight() {
        return Brick.calcHeight(this.blocks);
    }

    static calcHeight(blocks) {
        let height = 0;
        for (const i1 in blocks) {
            for (const i2 in blocks[i1]) {
                if (blocks[i1][i2] == 1) {
                    height = Math.max(height, (parseInt(i1) + 1));
                }
            }
        }
        return height;
    }

    getWidth() {
        return Brick.calcWidth(this.blocks);
    }

    static calcWidth(blocks) {
        let high = 0;

        let // 1E309 = infinity
            low = (1E309);

        let countrow = 0;
        for (const i1 in blocks) {
            countrow = 0;
            for (const i2 in blocks[i1]) {
                if (blocks[i1][i2] == 1) {
                    high = Math.max(high, (parseInt(i2) + 2));
                    low = Math.min(low, (parseInt(i2) + 2));
                    countrow++;
                }
            }
        }
        return (high - low) + 1;
    }

    getBlockY() {
        let cnt = 0;
        let rtn = 0;
        for (const i1 in this.blocks) {
            for (const i2 in this.blocks[i1]) {
                if (this.blocks[i1][i2] == 0) {
                    cnt++;
                }
            }
            if (cnt == this.blocks[0].length) {
                rtn++;
            } else {
                return rtn;
            }
        }

    }

    getBlockX() {
        return Brick.calcBlockX(this.blocks);
    }

    static calcBlockX(blocks) {
        let cnt = 0;
        let rtn = 0;
        for (let i = 0; i < 4; i++) {
            cnt = 0;
            for (const i1 in blocks) {
                if (blocks[i1][i] == 0) {
                    cnt++;
                }
            }
            if (cnt == blocks.length) {
                rtn++;
            } else {
                return rtn;
            }
        }
    }

    rotate_okay(brick, bl, Throw = false) {
        return Brick.calcValidPosition(0,0,Throw,brick.x,brick.y,bl,this.game.bricks,this.game,this.guid);
    }

    getRotatedBlocks() {
        const blocks2 = [];
        const w = this.blocks[0].length;
        const h = this.blocks.length;
        let x;
        let y;
        let row;
        for (y = 0; y < h; y++) {
            row = [];
            for (x = 0; x < w; x++) {
                row[x] = this.blocks[w - x - 1][y];
            }
            blocks2[y] = row;
        }
        return blocks2;
    }

    canRotate(Throw = false,blocks2 = null) {
        return this.rotate_okay(this,blocks2 || this.getRotatedBlocks(),Throw);
    }

    rotate(Throw = false) {
        if (this.game.running) {
            const blocks2 = this.getRotatedBlocks();
            if (this.canRotate(Throw, blocks2)) {
                //yeah
                this.requestUpdate();
            } else {
                var emulatedBrick = Brick.emulate(blocks2);
                if (((this.x + emulatedBrick.getWidth() + emulatedBrick.getBlockX()) > (this.game.width))) {
                    this.x--;
                    if (this.rotate_okay(this, blocks2)) {
                        // yeah
                        this.requestUpdate();
                    } else {
                        this.x++;
                        return false;
                    }
                } else if (((this.x + emulatedBrick.getBlockX()) < 0)) {
                    this.x++;
                    if (this.rotate_okay(this, blocks2)) {
                        //yeah
                        this.requestUpdate();
                    } else {
                        this.x--;
                        return false;
                    }
                } else {
                    return false;
                }
            }

            this.blocks = blocks2;
            this.#rotation = (this.#rotation + 1)% 4;
        }


    }

    get rotation() {
        return this.#rotation;
    }

    set rotation(v) {
        for (var i = this.#rotation; i <= v; i++)
            this.rotate();
        this.#rotation = v;
    }

    posInfo() {
        return [
            ["x", this.x],
            ["y", this.y],
            ["rotation", this.#rotation],
        ].map(x => x.join(":")).join(",");
    }

    validatePosition(x = 0,y = 0,Throw = false,px = undefined,py = undefined) {
        if (typeof(px) !== "number")
            px = this.x;
        if (typeof(py) !== "number")
            py = this.y;
        return Brick.calcValidPosition(x,y,Throw,px,py,this.blocks,this.game.bricks,this.game,this.guid);
    }

    static calcValidPosition(x = 0,y = 0,Throw,px,py,blocks,bricks,game,pguid) {
        if (((px + Brick.calcBlockX(blocks) + x) < 0)) {
            if (Throw === true)
                throw new Error("The brick would be out of bounds");
            return false;
        }

        if (((px + Brick.calcWidth(blocks) + Brick.calcBlockX(blocks) + x) > (game.width))) {
            if (Throw === true)
                throw new Error("The brick would be out of bounds");
            return false;
        }

        if ((py + Brick.calcHeight(blocks) + y) >= game.height) {
            if (Throw === true)
                throw new Error("The brick would be out of bounds");
            return false;
        }

        if (Brick.calcWillCollide(x, y, bricks, blocks, px, py, pguid)) {
            if (Throw === true)
                throw new Error("The brick would collide with another brick");
            return false;
        }

        return true;
    }

    canMoveLeft(Throw = false) {
        if (this.game.running != true) {
            if (Throw === true)
                throw new Error("The game is not running");
            return false;
        }
        if (this.moving != true) {
            if (Throw === true)
                throw new Error("The brick is not flagged as moving");
            return false;
        }

        return this.validatePosition(-1,0,Throw);
    }

    moveleft(Throw = false) {
        if (this.game.running) {
            if (this.ingame === true)
                playSound("gamemove");
            if (this.canMoveLeft(Throw)) {
                this.x--;
                return true;
            } else {
                if (Throw === true)
                    throw new Error("Unknown reason");
                return false;
            }
        } else {
            if (Throw === true)
                throw new Error("The game is not running");
        }
        console.debug("did not move right: out of conditions");
        return false;
    }

    get innerX() {
        return this.x - this.getBlockX();
    }

    get innerXfar() {
        return this.innerX + this.innerWidth;
    }

    get mostLeft() {
        return parseInt(-this.getBlockX());
    }

    get mostRight() {
        return parseInt(this.game.width - this.innerWidth - this.getBlockX());
    }

    get innerWidth() {
        return this.getWidth();
    }

    willCollide(x, y, bricks = null, blocks = null) {
        if (blocks == null)
            blocks = this.blocks;
        if (bricks == null)
            bricks = this.game.bricks;
        return Brick.calcWillCollide(x,y,bricks,blocks,this.x,this.y,this.guid);
    }

    static calcWillCollide(x, y, bricks, blocks, px, py, pguid) {
        var thisBlocks = Brick.calcAbsoluteBlocks(blocks,px,py,x,y);

        for (var brick of bricks) {
            if (brick.guid === pguid)
                continue;

            var opponentBlocks = brick.getAbsoluteBlocks();

            for (var thisBlock of thisBlocks) {
                for (var opponentBlock of opponentBlocks)
                    if (opponentBlock.x === thisBlock.x && opponentBlock.y === thisBlock.y)
                        return true;
            }
        }

        return false;
    }

    canMoveRight(Throw = false) {
        if (this.game.running != true) {
            if (Throw === true)
                throw new Error("The game is not running");
            return false;
        }
        if (this.moving != true) {
            if (Throw === true)
                throw new Error("The brick is not flagged as moving");
            return false;
        }

        return this.validatePosition(1,0,Throw);
    }

    moveright(Throw = false) {
        if (this.game.running) {
            if (this.ingame === true)
                playSound("gamemove");
            if (this.canMoveRight(Throw)) {
                this.x++;
                return true;
            } else {
                if (Throw === true)
                    throw new Error("Unknown reason");
                return false;
            }
        } else {
            if (Throw === true)
                throw new Error("The game is not running");
        }
        console.debug("did not move right: out of conditions");
        return false;
    }

    canSmashDown(Throw = false) {
        if (this.game.running != true) {
            if (Throw === true)
                throw new Error("The game is not running");
            return false;
        }
        return true;
    }

    smashdown(Throw = false) {
        if (this.canSmashDown(Throw)) {
            if (this.ingame === true)
                playSound("gamebump");
            this.moving = false;
            this.y = this.getLowestPosition();
            this.requestUpdate();
            if ((this.y + this.getBlockY()) >= 0) {
                const sliced = this.slice_up();
                this.game.bricks.splice(this.findMe(), 1);
                for (const i in sliced) {
                    this.game.bricks.push(sliced[i])
                }
                this.game.checkLines();
                this.game.addNewBrick();
                this.game.HOLDINGCOUNT = 0;
            } else {
                this.game.loseView();
                if (this.ingame === true)
                    playSound("gamelose");
            }

        }
    }

    canMoveDown(Throw = false) {
        if (this.game.running != true) {
            if (Throw === true)
                throw new Error("The game is not running");
            return false;
        }
        if (this.moving != true) {
            if (Throw === true)
                throw new Error("The brick is not flagged as moving");
            return false;
        }

        return this.validatePosition(0,1,Throw);
    }

    movedown(Throw = false) {
        if (this.game.running) {
            if (this.moving) {
                if (this.canMoveDown(Throw)) {
                    this.y++;
                } else {
                    this.moving = false;
                    if (this.ingame === true)
                        playSound("gamebump");
                    if ((this.y + this.getBlockY()) >= 0) {
                        const sliced = this.slice_up();
                        this.game.bricks.splice(this.findMe(), 1);
                        for (var i in sliced) {
                            this.game.bricks.push(sliced[i]);
                        }
                        this.game.checkLines();
                        this.game.addNewBrick();
                        this.game.HOLDINGCOUNT = 0;
                    } else {
                        this.game.loseView();
                        if (this.ingame === true)
                            playSound("gamelose");
                    }
                }
            }
        }
    }

    getLowestPosition(addX = 0) {
        const h = this.getHeight();
        let additionalY = 0;
        while (true) {
            if ((this.y + additionalY + h) > this.game.height)
                break;

            if (this.willCollide(addX, additionalY))
                break;

            additionalY++;
        }
        return (this.y + additionalY) - 1;
    }

    slice_up() {
        const rtn = [];
        let i;
        var i1;
        var i2;
        const this_color = this.color;
        for (var i1 in this.blocks) {
            for (var i2 in this.blocks[i1]) {
                if (this.blocks[i1][i2] == 1) {
                    rtn.push(((x, y, origin) => {
                        const tmp = new Brick();
                        tmp.moving = false;
                        tmp.blocks = [[1]];
                        tmp.color = this_color;
                        tmp.x = x;
                        tmp.y = y;
                        tmp.id = origin.id;
                        tmp.index = origin.index;
                        return tmp;
                    })(parseInt(i2) + this.x, parseInt(i1) + this.y, this));
                }
            }
        }
        return rtn;
    }

    findMe() {
        for (const i in this.game.bricks) {
            if (this.game.bricks[i] == this) {
                return i;
            }
        }
        console.warn("findMe could not find brick in game");
        return -1;
    }
}

Brick.emulate = vblocks => {
    const tmp = new Brick({
        ingame: false,
        game: null
    });
    tmp.moving = false;
    tmp.blocks = vblocks;
    return tmp;
}

export default Brick