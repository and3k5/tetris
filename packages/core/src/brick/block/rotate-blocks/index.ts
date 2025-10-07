/**
 * Returns a blocks array with the blocks data rotated to the right
 * @param {boolean[][]} blocks
 * @returns {boolean[][]}
 */
export function rotateRight(blocks) {
    return createRotatedBlocks(blocks, 1);
}

/**
 * Returns a blocks array with the blocks data rotated to the left
 * @param {boolean[][]} blocks
 * @returns {boolean[][]}
 */
export function rotateLeft(blocks) {
    return createRotatedBlocks(blocks, -1);
}

/**
 *
 * @param {boolean[][]} blocks
 * @returns {boolean[][]}
 */
export function rotateTwice(blocks) {
    return createRotatedBlocks(blocks, 2);
}

/**
 *
 * @param {boolean[][]} blocks Blocks array
 * @param {number} rotations Number of rotations
 */
export function createRotatedBlocks(blocks, rotations) {
    if (typeof rotations !== "number") throw new Error("rotations parameter must be a number");
    if (!isFinite(rotations)) throw new Error("rotations parameter must be a finite number");
    rotations = (4 + (rotations % 4)) % 4;
    if (rotations == 0) return blocks.concat();

    /**
     * @type {boolean[][]}
     */
    const blocks2 = [];
    const w = blocks[0].length;
    const h = blocks.length;
    for (let y = 0; y < h; y++) {
        /**
         * @type {boolean[]}
         */
        const row = [];
        let blocksRow = null;
        switch (rotations) {
            case 2:
                blocksRow = blocks[h - y - 1];
                break;
        }
        for (let x = 0; x < w; x++) {
            switch (rotations) {
                case 1:
                    blocksRow = blocks[w - x - 1];
                    row[x] = blocksRow[y];
                    break;
                case 2:
                    row[x] = blocksRow[w - x - 1];
                    break;
                case 3:
                    blocksRow = blocks[x];
                    row[x] = blocksRow[h - y - 1];
                    break;
            }
        }
        blocks2[y] = row;
    }
    return blocks2;
}
