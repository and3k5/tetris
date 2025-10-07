import { StaticNextBrick } from "../logic/next-brick";

export class TetrisSetup {
    // different types of bricks
    private _brickforms;

    // game width
    private _width;

    // game height
    private _height;

    private _graphics;

    // brick sequence
    private _sequence = null;

    private _nextBrick = null;

    /**
     *
     * @param {BrickFormBase[]} brickforms
     */
    constructor(brickforms, width, height, extra = {}) {
        this._brickforms = brickforms;
        this._width = width;
        this._height = height;
        this._graphics = extra.graphics;
        this._nextBrick = extra.nextBrick;
    }

    get nextBrick() {
        return this._nextBrick;
    }

    get brickforms() {
        return this._brickforms;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get sequence() {
        return this._sequence;
    }

    get graphics() {
        return this._graphics;
    }

    setSequence() {
        this._sequence = this.brickforms.concat().map((v, i) => i);
    }
}

export function defaultGame() {
    const brickforms = [
        [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1],
        ],

        [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0],
        ],

        [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ],

        [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ],

        [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ],

        [
            [1, 1],
            [1, 1],
        ],

        [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ],
    ];

    return new TetrisSetup(brickforms, 10, 20);
}

export function easyGame2() {
    const brickforms = [
        [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1],
        ],

        [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0],
        ],

        [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ],
    ];
    const setup = new TetrisSetup(brickforms, 10, 20);
    setup.setSequence();
    return setup;
}

export function easyGame() {
    const brickforms = [
        [
            [1, 1],
            [1, 1],
        ],
    ];
    return new TetrisSetup(brickforms, 10, 20);
}

export function longPieceGame() {
    const brickforms = [
        [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ],
    ];
    return new TetrisSetup(brickforms, 10, 20);
}

export function shitGame() {
    const brickforms = [
        [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ],
    ];
    return new TetrisSetup(brickforms, 10, 20);
}

/**
 *
 * @param {Number[][]} blocks
 */
export function predictableGameWithOneBlock(blocks) {
    const brickforms = [blocks];
    return new TetrisSetup(brickforms, 10, 20, { nextBrick: new StaticNextBrick(0) });
}
