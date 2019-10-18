import { playSound } from "./sound.js";
import * as console from "../utils/trace.js";

class Brick {
    #x = undefined;
    #y = undefined;
    #rotation = 0;
    constructor(options) {
        const o = options || { 'ingame': false, 'game': null };

        this.game = o.game;
        this.ingame = o.ingame;

        if (this.ingame) {
            const brfrm = this.game.brickforms;
            const rnd = this.game.nextRandom;
            this.color = this.game.getColors()[rnd].copy();
            this.blocks = brfrm[rnd].concat();
            this.moving = true;
            this.x = Math.round(((this.game.getWIDTH()) / 2) - (this.blocks[0].length / 2));
            this.y = Math.round(0 - (this.blocks.length));
            this.game.nextRandom = Math.round(Math.random() * (brfrm.length - 1));
        }else if (o.brickform != null) {
            this.color = this.game.getColors()[0].copy();
            this.blocks = o.brickform.concat();
        }

        if (typeof(o.x) === "number" && typeof(o.y) === "number") {
            this.x = o.x;
            this.y = o.y;
        }
    }

    clone() {
        var brick = new Brick();
        brick.#x = this.#x;
        brick.#y = this.#y;
        brick.moving = this.moving;
        brick.blocks = this.blocks.concat();
        brick.color = this.color.copy();
        brick.#rotation = this.#rotation;
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

    requestUpdate() {
        if (this.ingame && (this.game != null)) {
            this.game.PENDINGUPDATE = true;
        }
    }

    resetPosition() {
        this.x = Math.round(((this.game.getWIDTH()) / 2) - (this.blocks[0].length / 2));
        this.y = Math.round(0 - (this.blocks.length));
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

    rotate_okay(brick, bl) {
        for (const i1 in bl) {
            for (const i2 in bl[i1]) {
                if (bl[i1][i2] == 1) {
                    if ((brick.checkCollision(brick.x + parseInt(i2), brick.y + parseInt(i1), this.game.bricks) == false) || ((brick.y + Brick.emulate(bl).getHeight()) >= this.game.HEIGHT) || ((brick.x + Brick.emulate(bl).getWidth() + Brick.emulate(bl).getBlockX()) > (this.game.getWIDTH())) || ((brick.x + Brick.emulate(bl).getBlockX()) < 0)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    rotate() {
        if (this.game.getRUNNING()) {
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
            if (this.rotate_okay(this, blocks2)) {
                //yeah
                this.requestUpdate();
            } else {
                if (((this.x + Brick.emulate(blocks2).getWidth() + Brick.emulate(blocks2).getBlockX()) > (this.game.getWIDTH()))) {
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
        if (this.game.getRUNNING() != true) {
            if (Throw === true)
                throw new Error("The game is not running");
            return false;
        }
        if (this.moving != true) {
            if (Throw === true)
                throw new Error("The brick is not flagged as moving");
            return false;
        }

        for (const i1 in this.blocks) {
            for (const i2 in this.blocks[i1]) {
                if (this.blocks[i1][i2] == 1) {
                    if (((this.x + this.getBlockX()) <= 0)) {
                        if (Throw === true)
                            throw new Error("The brick would be out of bounds:"+this.posInfo());
                        return false;
                    }
                    if ((this.checkCollision(this.x + parseInt(i2) - 1, this.y + parseInt(i1), this.game.bricks) == false)) {
                        if (Throw === true)
                            throw new Error("The brick would collide with another brick");
                        return false;
                    }
                }
            }
        }

        return true;
    }

    moveleft(Throw = false) {
        if (this.game.getRUNNING()) {
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
        return parseInt(this.game.WIDTH - this.innerWidth - this.getBlockX());
    }

    get innerWidth() {
        return this.getWidth();
    }

    canMoveRight(Throw = false) {
        if (this.game.getRUNNING() != true) {
            if (Throw === true)
                throw new Error("The game is not running");
            return false;
        }
        if (this.moving != true) {
            if (Throw === true)
                throw new Error("The brick is not flagged as moving");
            return false;
        }

        for (const i1 in this.blocks) {
            for (const i2 in this.blocks[i1]) {
                if (this.blocks[i1][i2] == 1) {
                    if (((this.x + this.getWidth() + this.getBlockX()) >= (this.game.getWIDTH()))) {
                        if (Throw === true)
                            throw new Error("The brick would be out of bounds:"+this.posInfo());
                        return false;
                    }
                    if ((this.checkCollision(this.x + parseInt(i2) + 1, this.y + parseInt(i1), this.game.bricks) == false)) {
                        if (Throw === true)
                            throw new Error("The brick would collide with another brick");
                        return false;
                    }
                }
            }
        }

        return true;
    }

    moveright(Throw = false) {
        if (this.game.getRUNNING()) {
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
        if (this.game.getRUNNING() != true) {
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
                this.game.bricks.push(new Brick({
                    ingame: true,
                    game: this.game
                }));
                this.game.HOLDINGCOUNT = 0;
            } else {
                menuNav("gamelose");
                if (this.ingame === true)
                    playSound("gamelose");
            }

        }
    }

    canMoveDown(Throw = false) {
        if (this.game.getRUNNING() != true) {
            if (Throw === true)
                throw new Error("The game is not running");
            return false;
        }
        if (this.moving != true) {
            if (Throw === true)
                throw new Error("The brick is not flagged as moving");
            return false;
        }

        for (const i1 in this.blocks) {
            for (const i2 in this.blocks[i1]) {
                if (this.blocks[i1][i2] == 1) {
                    if ((this.y + this.getHeight()) >= this.game.HEIGHT) {
                        if (Throw === true)
                            throw new Error("The brick would be out of bounds:" + this.posInfo());
                        return false;
                    }
                    if (this.checkCollision(this.x + parseInt(i2), this.y + parseInt(i1) + 1, this.game.bricks) == false) {
                        if (Throw === true)
                            throw new Error("The brick would collide with another brick");
                        return false;
                    }
                }
            }
        }

        return true;
    }

    movedown(Throw = false) {
        if (this.game.getRUNNING()) {
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
                        this.game.bricks.push(new Brick({
                            ingame: true,
                            game: this.game
                        }));
                        this.game.HOLDINGCOUNT = 0;
                    } else {
                        menuNav("gamelose");
                        if (this.ingame === true)
                            playSound("gamelose");
                    }
                }
            }
        }
    }

    getLowestPosition() {
        const br = this.game.bricks;
        const h = this.getHeight();
        const this_x = this.x;
        let this_y = this.y;
        let stillgood = true;
        let isgood = true;
        while ((stillgood)) {
            isgood = true;
            for (const i1 in this.blocks) {
                for (const i2 in this.blocks[i1]) {
                    if (this.blocks[i1][i2] == 1) {
                        if ((this.checkCollision(this_x + parseInt(i2), this_y + parseInt(i1), br) == false) || ((this_y + h) > this.game.HEIGHT)) {
                            isgood = false;
                        } else { }
                    }
                }
            }
            if (isgood == true) {
                this_y++;
            } else {
                stillgood = false;
            }
        }
        return this_y - 1;
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
                    rtn.push(((x, y) => {
                        const tmp = new Brick();
                        tmp.moving = false;
                        tmp.blocks = [[1]];
                        tmp.color = this_color;
                        tmp.x = x;
                        tmp.y = y;
                        return tmp;
                    })(parseInt(i2) + this.x, parseInt(i1) + this.y));
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