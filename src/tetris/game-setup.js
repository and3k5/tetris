import "./brick-form.js"

export class TetrisSetup {
    #brickforms;

    /**
     * 
     * @param {BrickFormBase[]} brickforms 
     */
    constructor(brickforms) {
        this.#brickforms = brickforms;
    }

    get brickforms() {
        return this.#brickforms;
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
    return new TetrisSetup(brickforms);
}