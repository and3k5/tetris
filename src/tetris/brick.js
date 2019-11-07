import { playSound } from "./sound.js";
import * as console from "../utils/trace.js";

class Brick {
    #x = undefined;
    #y = undefined;
    #rotation = 0;
    #index = undefined;
    constructor(options) {
        const o = options || { 'ingame': false, 'game': null };

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

    get index() {
        return this.#index;
    }

    set index(v) {
        this.#index = v;
    }

    clone() {
        var brick = new Brick();
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

        var result = [];

        var offsetX = this.x + x;
        var offsetY = this.y + y;

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
        let height = 0;
        for (const i1 in this.blocks) {
            for (const i2 in this.blocks[i1]) {
                if (this.blocks[i1][i2] == 1) {
                    height = Math.max(height, (parseInt(i1) + 1));
                }
            }
        }
        return height;
    }

    getWidth() {
        let high = 0;

        let // 1E309 = infinity
            low = (1E309);

        let countrow = 0;
        for (const i1 in this.blocks) {
            countrow = 0;
            for (const i2 in this.blocks[i1]) {
                if (this.blocks[i1][i2] == 1) {
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
        let cnt = 0;
        let rtn = 0;
        for (let i = 0; i < 4; i++) {
            cnt = 0;
            for (const i1 in this.blocks) {
                if (this.blocks[i1][i] == 0) {
                    cnt++;
                }
            }
            if (cnt == this.blocks.length) {
                rtn++;
            } else {
                return rtn;
            }
        }
    }

    rotate_okay(brick, bl, Throw = false) {
        var emulatedBrick = Brick.emulate(bl);
        if ((brick.y + emulatedBrick.getHeight()) >= this.game.height)
        {
            if (Throw === true)
                throw new Error("The brick would be out of bounds:" + this.posInfo());
            return false;
        }

        if (((brick.x + emulatedBrick.width + emulatedBrick.getBlockX()) > (this.game.width)))
        {
            if (Throw === true)
                throw new Error("The brick would be out of bounds:" + this.posInfo());
            return false;
        }

        if (((brick.x + emulatedBrick.getBlockX()) < 0))
        {
            if (Throw === true)
                throw new Error("The brick would be out of bounds:" + this.posInfo());
            return false;
        }

        if (this.willCollide(0, 0, null, bl))
        {
            if (Throw === true)
                throw new Error("The brick would collide with another brick");
            return false;
        }

        return true;
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
                if (((this.x + Brick.emulate(blocks2).getWidth() + Brick.emulate(blocks2).getBlockX()) > (this.game.width))) {
                    this.x--;
                    if (this.rotate_okay(this, blocks2)) {
                        // yeah
                        this.requestUpdate();
                    } else {
                        this.x++;
                        return false;
                    }
                } else if (((this.x + Brick.emulate(blocks2).getBlockX()) < 0)) {
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

        if (((this.x + this.getBlockX()) <= 0)) {
            if (Throw === true)
                throw new Error("The brick would be out of bounds:" + this.posInfo());
            return false;
        }

        if (this.willCollide(-1, 0)) {
            if (Throw === true)
                throw new Error("The brick would collide with another brick");
            return false;
        }

        return true;
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

        var thisBlocks = this.getAbsoluteBlocks(blocks, x, y);

        if (bricks == null)
            bricks = this.game.bricks;

        for (var brick of bricks) {
            if (brick === this)
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

        if (((this.x + this.getWidth() + this.getBlockX()) >= (this.game.width))) {
            if (Throw === true)
                throw new Error("The brick would be out of bounds:" + this.posInfo());
            return false;
        }

        if (this.willCollide(1, 0)) {
            if (Throw === true)
                throw new Error("The brick would collide with another brick");
            return false;
        }

        return true;
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

        if ((this.y + this.getHeight()) >= this.game.height) {
            if (Throw === true)
                throw new Error("The brick would be out of bounds:" + this.posInfo());
            return false;
        }

        if (this.willCollide(0, 1)) {
            if (Throw === true)
                throw new Error("The brick would collide with another brick");
            return false;
        }

        return true;
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

    getLowestPosition() {
        const h = this.getHeight();
        let additionalY = 0;
        while (true) {
            if ((this.y + additionalY + h) > this.game.height)
                break;

            if (this.willCollide(0, additionalY))
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