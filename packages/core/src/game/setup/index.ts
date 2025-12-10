import { Blocks } from "../../brick/brick";
import { BrickFormBase } from "../../brick/form";
import { StaticNextBrick } from "../logic/next-brick";

export function convertNumbersToBooleans(blocks: number): boolean;
export function convertNumbersToBooleans(blocks: number[]): boolean[];
export function convertNumbersToBooleans(blocks: number[][]): boolean[][];
export function convertNumbersToBooleans(blocks: number[][][]): boolean[][][];
export function convertNumbersToBooleans(
    blocks: number | number[] | number[][] | number[][][],
): boolean | boolean[] | boolean[][] | boolean[][][] {
    if (typeof blocks === "number") {
        return blocks >= 1 ? true : false;
    } else {
        return blocks.map((x) => convertNumbersToBooleans(x));
    }
}

export interface ITetrisSetup {
    brickforms: (BrickFormBase | Blocks)[];
    width: number;
    height: number;
    graphics?: unknown;
    sequence?: number[];
    nextBrick?: unknown;
    logger?: boolean;
    simulator?: boolean;
    simulateMode?: "fast" | undefined;
    simulation?: { type: "nextRandom"; val: number; time: number }[];
    clickTick?: boolean;
}

export class TetrisSetup implements ITetrisSetup {
    // different types of bricks
    private _brickforms: (BrickFormBase | Blocks)[];

    // game width
    private _width: number;

    // game height
    private _height: number;

    private _graphics: unknown;

    // brick sequence
    private _sequence = null;

    private _nextBrick = null;

    logger = false;

    constructor(
        brickforms: BrickFormBase[] | Blocks[],
        width,
        height,
        extra: { graphics?: unknown; nextBrick?: unknown } = {},
    ) {
        this._brickforms = brickforms;
        this._width = width;
        this._height = height;
        this._graphics = extra.graphics;
        this._nextBrick = extra.nextBrick;
    }
    simulator?: boolean;
    simulateMode?: "fast";
    simulation?: { type: "nextRandom"; val: number; time: number }[];
    clickTick?: boolean;

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

    return new TetrisSetup(convertNumbersToBooleans(brickforms), 10, 20);
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
    const setup = new TetrisSetup(convertNumbersToBooleans(brickforms), 10, 20);
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
    return new TetrisSetup(convertNumbersToBooleans(brickforms), 10, 20);
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
    return new TetrisSetup(convertNumbersToBooleans(brickforms), 10, 20);
}

export function shitGame() {
    const brickforms = [
        [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ],
    ];
    return new TetrisSetup(convertNumbersToBooleans(brickforms), 10, 20);
}

export function predictableGameWithOneBlock(blocks: Blocks) {
    const brickforms = [blocks];
    return new TetrisSetup(brickforms, 10, 20, {
        nextBrick: new StaticNextBrick(0),
    });
}
