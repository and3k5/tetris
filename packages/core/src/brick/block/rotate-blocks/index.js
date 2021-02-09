export function calcRotatedBlocks(blocks) {
    const blocks2 = [];
    const w = blocks[0].length;
    const h = blocks.length;
    for (let y = 0; y < h; y++) {
        let row = [];
        for (let x = 0; x < w; x++) {
            row[x] = blocks[w - x - 1][y];
        }
        blocks2[y] = row;
    }
    return blocks2;
}