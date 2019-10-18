import "./brick-form.js"

export class TetrisSetup {
    // different types of bricks
    #brickforms;

    // game width
    #width;

    // game height
    #height;

    /**
     * 
     * @param {BrickFormBase[]} brickforms 
     */
    constructor(brickforms, width, height) {
        this.#brickforms = brickforms;
        this.#width = width;
        this.#height = height;
    }

    get brickforms() {
        return this.#brickforms;
    }

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
    }
}

export function defaultGame() {
    const brickforms = [
        [[0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]],

        [[0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]],

        [[0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]],

        [[1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]],

        [[0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]],

        [[1, 1],
        [1, 1]],

        [[0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]]
    ];
    return new TetrisSetup(brickforms, 10, 20);
}

export function easyGame() {
    const brickforms = [
        [[1, 1],
        [1, 1]],
    ];
    return new TetrisSetup(brickforms, 10, 20);
}

export function longPieceGame() {
    const brickforms = [
        [[0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]]
    ];
    return new TetrisSetup(brickforms, 10, 20);
}

export function shitGame() {
    const brickforms = [
        [[0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]],
    ];
    return new TetrisSetup(brickforms, 10, 20);
}