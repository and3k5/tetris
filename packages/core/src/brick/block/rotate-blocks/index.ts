export function rotateRight(blocks: boolean[][]): boolean[][] {
    return createRotatedBlocks(blocks, 1);
}

export function rotateLeft(blocks: boolean[][]): boolean[][] {
    return createRotatedBlocks(blocks, -1);
}

export function rotateTwice(blocks: boolean[][]): boolean[][] {
    return createRotatedBlocks(blocks, 2);
}

export function createRotatedBlocks<T>(blocks: T[][], rotations: number) {
    if (typeof rotations !== "number") throw new Error("rotations parameter must be a number");
    if (!isFinite(rotations)) throw new Error("rotations parameter must be a finite number");
    rotations = (4 + (rotations % 4)) % 4;
    if (rotations == 0) return blocks.concat();

    const blocks2: boolean[][] = [];
    const w = blocks[0].length;
    const h = blocks.length;
    for (let y = 0; y < h; y++) {
        const row: boolean[] = [];
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
