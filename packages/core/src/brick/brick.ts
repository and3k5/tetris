import { guid, trace as console } from "../utils";
import { createRotatedBlocks, rotateLeft, rotateRight, rotateTwice } from "./block/rotate-blocks";
const { createUniqueGuid } = guid;

export class Brick {
    private _x = undefined;
    private _y = undefined;
    private _rotation = 0;
    private _index = undefined;
    private _guid;
    constructor(options) {
        const o = options || { ingame: false, game: null };
        if (typeof o.guid === "string") this._guid = o.guid;
        else this._guid = createUniqueGuid();

        this.game = o.game;
        this.ingame = o.ingame;

        if (o.brickform != null) {
            if (this.game != null) this.color = this.game.getColors()[0].copy();
            this.blocks = o.brickform.concat();
        }

        if (typeof o.x === "number" && typeof o.y === "number") {
            this.x = o.x;
            this.y = o.y;
        }
    }

    get guid() {
        return this._guid;
    }

    get index() {
        return this._index;
    }

    set index(v) {
        this._index = v;
    }

    clone() {
        const brick = new Brick({ guid: this._guid });

        brick._x = this._x;
        brick._y = this._y;
        brick.moving = this.moving;
        brick.blocks = this.blocks.concat();
        brick.color = this.color.copy();
        brick._rotation = this._rotation;
        brick.index = this.index;
        return brick;
    }

    get x() {
        return this._x;
    }

    set x(v) {
        this._x = v;
        this.requestUpdate();
    }

    get y() {
        return this._y;
    }

    set y(v) {
        this._y = v;
        this.requestUpdate();
    }

    get containerWidth() {
        return this.blocks[0].length;
    }

    get containerHeight() {
        return this.blocks.length;
    }

    requestUpdate() {
        if (this.ingame && this.game != null) {
            this.game.PENDINGUPDATE = true;
        }
    }

    resetPosition() {
        this.x = Math.round(this.game.width / 2 - this.blocks[0].length / 2);
        this.y = Math.round(0 - this.blocks.length);
    }

    getAbsoluteBlocks(blocks = null, x = 0, y = 0) {
        if (blocks == null) blocks = this.blocks;
        return Brick.calcAbsoluteBlocks(blocks, this.x, this.y, x, y);
    }

    // todo make static
    static calcAbsoluteBlocks(blocks, px, py, x = 0, y = 0) {
        const result = [];

        const offsetX = px + x;
        const offsetY = py + y;

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
                        const cond1 = x == brcks[i].x + parseInt(i2);
                        const cond2 = y == brcks[i].y + parseInt(i1);
                        const cond3 = this != brcks[i];
                        if (cond1 && cond2 && cond3) {
                            return false;
                        }
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
                    height = Math.max(height, parseInt(i1) + 1);
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
            low = 1e309;

        for (const i1 in blocks) {
            for (const i2 in blocks[i1]) {
                if (blocks[i1][i2] == 1) {
                    high = Math.max(high, parseInt(i2) + 2);
                    low = Math.min(low, parseInt(i2) + 2);
                }
            }
        }
        return high - low + 1;
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
        return Brick.calcValidPosition(
            0,
            0,
            Throw,
            brick.x,
            brick.y,
            bl,
            this.game.bricks,
            this.game,
            this.guid,
        );
    }

    createRotatedRightBlocks() {
        return Brick.rotateRight(this.blocks);
    }

    static rotateRight(blocks) {
        return rotateRight(blocks);
    }

    createRotatedLeftBlocks() {
        return Brick.rotateLeft(this.blocks);
    }

    static rotateLeft(blocks) {
        return rotateLeft(blocks);
    }

    createRotatedTwiceBlocks() {
        return Brick.rotateTwice(this.blocks);
    }

    static rotateTwice(blocks) {
        return rotateTwice(blocks);
    }

    createRotatedBlocks(rotations) {
        return Brick.rotateBlocks(this.blocks, rotations);
    }

    static rotateBlocks(blocks, rotations) {
        return createRotatedBlocks(blocks, rotations);
    }

    canRotate(Throw = false, blocks2 = null) {
        return this.rotate_okay(this, blocks2 || this.createRotatedRightBlocks(), Throw);
    }

    rotate(Throw = false) {
        if (this.game.running) {
            const blocks2 = this.createRotatedRightBlocks();
            if (this.canRotate(Throw, blocks2)) {
                //yeah
                this.requestUpdate();
            } else {
                const blockX = Brick.calcBlockX(blocks2);
                const width = Brick.calcWidth(blocks2);

                if (
                    !Brick.calcValidPosition_xOutRight(0, false, this.x, blockX, width, this.game)
                ) {
                    this.x--;
                    if (this.rotate_okay(this, blocks2)) {
                        // yeah
                        this.requestUpdate();
                    } else {
                        this.x++;
                        return false;
                    }
                } else if (!Brick.calcValidPosition_xOutLeft(0, false, this.x, blockX, this.game)) {
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
            this._rotation = (this._rotation + 1) % 4;
        }
    }

    get rotation() {
        return this._rotation;
    }

    set rotation(v) {
        for (let i = this._rotation; i <= v; i++) this.rotate();
        this._rotation = v;
    }

    posInfo() {
        return [
            ["x", this.x],
            ["y", this.y],
            ["rotation", this._rotation],
        ]
            .map((x) => x.join(":"))
            .join(",");
    }

    validatePosition(x = 0, y = 0, Throw = false, px = undefined, py = undefined) {
        if (typeof px !== "number") px = this.x;
        if (typeof py !== "number") py = this.y;
        return Brick.calcValidPosition(
            x,
            y,
            Throw,
            px,
            py,
            this.blocks,
            this.game.bricks,
            this.game,
            this.guid,
        );
    }

    static calcValidPosition_xOutRight(x = 0, Throw, px, blockX, width, game) {
        if (px + width + blockX + x > game.width) {
            if (Throw === true) throw new Error("The brick would be out of bounds");
            return false;
        }

        return true;
    }

    static calcValidPosition_xOutLeft(x = 0, Throw, px, blockX) {
        if (px + blockX + x < 0) {
            if (Throw === true) throw new Error("The brick would be out of bounds");
            return false;
        }

        return true;
    }

    static calcValidPosition(x = 0, y = 0, Throw, px, py, blocks, bricks, game, pguid) {
        const blockX = Brick.calcBlockX(blocks);
        if (!Brick.calcValidPosition_xOutLeft(x, Throw, px, blockX, game)) return false;

        const width = Brick.calcWidth(blocks);
        if (!Brick.calcValidPosition_xOutRight(x, Throw, px, blockX, width, game)) return false;

        if (py + Brick.calcHeight(blocks) + y > game.height) {
            if (Throw === true) throw new Error("The brick would be out of bounds");
            return false;
        }

        if (Brick.calcWillCollide(x, y, bricks, blocks, px, py, pguid)) {
            if (Throw === true) throw new Error("The brick would collide with another brick");
            return false;
        }

        return true;
    }

    canMoveLeft(Throw = false) {
        if (this.game.running != true) {
            if (Throw === true) throw new Error("The game is not running");
            return false;
        }
        if (this.moving != true) {
            if (Throw === true) throw new Error("The brick is not flagged as moving");
            return false;
        }

        return this.validatePosition(-1, 0, Throw);
    }

    moveleft(Throw = false) {
        if (this.game.running) {
            if (this.ingame === true) this.game.runEvent("fx", null, "sound", "gamemove");
            if (this.canMoveLeft(Throw)) {
                this.x--;
                return true;
            } else {
                if (Throw === true) throw new Error("Unknown reason");
                return false;
            }
        } else {
            if (Throw === true) throw new Error("The game is not running");
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
        return Brick.calcMostLeft(this.blocks);
    }

    static calcMostLeft(blocks) {
        return parseInt(-Brick.calcBlockX(blocks));
    }

    get mostRight() {
        return Brick.calcMostRight(this.game.width, this.blocks);
    }

    static calcMostRight(width, blocks) {
        return parseInt(width - Brick.calcWidth(blocks) - Brick.calcBlockX(blocks));
    }

    get innerWidth() {
        return this.getWidth();
    }

    willCollide(x, y, bricks = null, blocks = null) {
        if (blocks == null) blocks = this.blocks;
        if (bricks == null) bricks = this.game.bricks;
        return Brick.calcWillCollide(x, y, bricks, blocks, this.x, this.y, this.guid);
    }

    static calcWillCollide(x, y, bricks, blocks, px, py, pguid) {
        const thisBlocks = Brick.calcAbsoluteBlocks(blocks, px, py, x, y);

        for (const brick of bricks) {
            if (brick.guid === pguid) continue;

            const opponentBlocks = brick.getAbsoluteBlocks();

            for (const thisBlock of thisBlocks) {
                for (const opponentBlock of opponentBlocks)
                    if (opponentBlock.x === thisBlock.x && opponentBlock.y === thisBlock.y)
                        return true;
            }
        }

        return false;
    }

    canMoveRight(Throw = false) {
        if (this.game.running != true) {
            if (Throw === true) throw new Error("The game is not running");
            return false;
        }
        if (this.moving != true) {
            if (Throw === true) throw new Error("The brick is not flagged as moving");
            return false;
        }

        return this.validatePosition(1, 0, Throw);
    }

    moveright(Throw = false) {
        if (this.game.running) {
            if (this.ingame === true) this.game.runEvent("fx", null, "sound", "gamemove");
            if (this.canMoveRight(Throw)) {
                this.x++;
                return true;
            } else {
                if (Throw === true) throw new Error("Unknown reason");
                return false;
            }
        } else {
            if (Throw === true) throw new Error("The game is not running");
        }
        console.debug("did not move right: out of conditions");
        return false;
    }

    canSmashDown(Throw = false) {
        if (this.game.running != true) {
            if (Throw === true) throw new Error("The game is not running");
            return false;
        }
        return true;
    }

    smashdown(Throw = false) {
        if (this.canSmashDown(Throw)) {
            if (this.ingame === true) this.game.runEvent("fx", null, "sound", "gamebump");
            this.moving = false;
            this.y = this.getLowestPosition();
            this.requestUpdate();
            if (this.y + this.getBlockY() >= 0) {
                const sliced = this.slice_up();
                this.game.bricks.splice(this.findMe(), 1);
                for (const i in sliced) {
                    this.game.bricks.push(sliced[i]);
                }
                this.game.checkLines();
                this.game.addNewBrick();
                this.game.HOLDINGCOUNT = 0;
            } else {
                this.game.loseView();
                if (this.ingame === true) this.game.runEvent("fx", null, "sound", "gamelose");
            }
        }
    }

    canMoveDown(Throw = false) {
        if (this.game.running != true) {
            if (Throw === true) throw new Error("The game is not running");
            return false;
        }
        if (this.moving != true) {
            if (Throw === true) throw new Error("The brick is not flagged as moving");
            return false;
        }

        return this.validatePosition(0, 1, Throw);
    }

    movedown(Throw = false) {
        if (this.game.running) {
            if (this.moving) {
                if (this.canMoveDown(Throw)) {
                    this.y++;
                } else {
                    this.moving = false;
                    if (this.ingame === true) this.game.runEvent("fx", null, "sound", "gamebump");
                    if (this.y + this.getBlockY() >= 0) {
                        const sliced = this.slice_up();
                        this.game.bricks.splice(this.findMe(), 1);
                        for (const i in sliced) {
                            this.game.bricks.push(sliced[i]);
                        }
                        this.game.checkLines();
                        this.game.addNewBrick();
                        this.game.HOLDINGCOUNT = 0;
                    } else {
                        this.game.loseView();
                        if (this.ingame === true)
                            this.game.runEvent("fx", null, "sound", "gamelose");
                    }
                }
            }
        }
    }

    getLowestPosition(addX = 0) {
        return Brick.calcLowestPosition(
            this.blocks,
            addX,
            this.game.height,
            this.game.bricks,
            this.x,
            this.y,
            this.guid,
        );
    }

    /**
     *
     * @param {any} blocks
     * @param {any} addX
     * @param {Number} height
     * @param {Brick[]} bricks
     * @param {*} px
     * @param {*} py
     * @param {*} pguid
     */
    static calcLowestPosition(blocks, addX = 0, height, bricks, px, py, pguid) {
        const h = Brick.calcHeight(blocks);
        let additionalY = 0;
         
        while (true) {
            if (py + additionalY + h > height) break;

            if (Brick.calcWillCollide(addX, additionalY, bricks, blocks, px, py, pguid)) break;

            additionalY++;
        }
        return py + additionalY - 1;
    }

    slice_up() {
        const rtn = [];
        const this_color = this.color;
        for (const i1 in this.blocks) {
            for (const i2 in this.blocks[i1]) {
                if (this.blocks[i1][i2] == 1) {
                    rtn.push(
                        ((x, y, origin) => {
                            const tmp = new Brick();
                            tmp.moving = false;
                            tmp.blocks = [[1]];
                            tmp.color = this_color;
                            tmp.x = x;
                            tmp.y = y;
                            tmp.id = origin.id;
                            tmp.index = origin.index;
                            return tmp;
                        })(parseInt(i2) + this.x, parseInt(i1) + this.y, this),
                    );
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

Brick.emulate = (vblocks) => {
    const tmp = new Brick({
        ingame: false,
        game: null,
    });
    tmp.moving = false;
    tmp.blocks = vblocks;
    return tmp;
};
