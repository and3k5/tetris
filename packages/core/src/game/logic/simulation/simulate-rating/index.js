import { sortBy } from "../../../../utils/sorting";

export function countClearingLines(matrix) {
    let clearingLines = 0;
    for (var y = matrix.length - 1; y >= 0; y--) {
        if (matrix[y].filter(x => x !== true).length === 0) {
            clearingLines++;
        }
    }
    return clearingLines;
}

function swapXY(matrix) {
    var aLength = matrix.length;
    var bLength = matrix[0].length;

    var result = [];

    while (result.length < bLength) {
        var row = [];
        while (row.length < aLength) {
            row.push(undefined);
        }
        result.push(row);
    }

    for (var a = 0; a < aLength; a++) {

        for (var b = 0; b < bLength; b++) {
            result[b][a] = matrix[a][b]
        }
    }

    return result;
}

export function countHoles(matrix) {
    let holes = 0;

    matrix = swapXY(matrix);

    for (var x = 0; x < matrix.length; x++) {
        var topBlockIndex = matrix[x].indexOf(true);

        if (topBlockIndex === -1)
            continue;

        for (var y = topBlockIndex; y < matrix[x].length; y++) {
            if (matrix[x][y] === false)
                holes++;
        }
    }
    return holes;
}

export function countHeight(matrix) {
    let height = 0;

    matrix = swapXY(matrix);

    let gameHeight = null;

    for (var x = 0; x < matrix.length; x++) {
        const col = matrix[x];
        if (gameHeight == null)
            gameHeight = col.length;
        var index = col.indexOf(true);
        if (index < 0)
            continue;
        var xHeight = col.length - index;

        if (xHeight > height)
            height = xHeight;
    }
    return { blocksHeight: height, gameHeight };
}

export class Score {
    constructor({ clearingLines, holes, height }) {
        this.clearingLines = clearingLines;
        this.holes = holes;
        this.height = height;
    }

    /**
     * 
     * @param {Score} score 
     * @param {Score} worstScore 
     * @param {Score} bestScore 
     */
    getRatio(worstScore, bestScore) {
        const clearingLinesRatio = ratioValue(worstScore.clearingLines, bestScore.clearingLines, this.clearingLines);
        const holesRatio = ratioValue(worstScore.holes, bestScore.holes, this.holes);
        //const heightRatio = ratioValue(worstScore.height, bestScore.height, this.height);
        const heightRatio = 1 - (this.height.blocksHeight / this.height.gameHeight);

        return ((clearingLinesRatio * 3) + (holesRatio * 2) + heightRatio) / 6;
    }
}

export function getScore(matrix) {
    const clearingLines = countClearingLines(matrix);
    const holes = countHoles(matrix);
    const height = countHeight(matrix);

    return new Score({
        holes,
        height,
        clearingLines,
    });
}

export function ratioValue(worst, best, current) {
    if (worst == best)
        return 1;

    let result = (current - worst) / (best - worst)

    return result;
}

function getWorstScoreValues(positions) {
    positions = positions.concat();
    const clearingLines = sortBy(s => s.scores.clearingLines, false).execute(positions)[0].scores.clearingLines;
    const height = sortBy(s => s.scores.height, true).execute(positions)[0].scores.height;
    const holes = sortBy(s => s.scores.holes, true).execute(positions)[0].scores.holes;
    return new Score({ clearingLines, holes, height });
}

function getBestScoreValues(positions) {
    positions = positions.concat();
    const clearingLines = sortBy(s => s.scores.clearingLines, true).execute(positions)[0].scores.clearingLines;
    const height = sortBy(s => s.scores.height, false).execute(positions)[0].scores.height;
    const holes = sortBy(s => s.scores.holes, false).execute(positions)[0].scores.holes;
    return new Score({ clearingLines, holes, height });
}

export function sortMovements(positions) {
    const worstScore = getWorstScoreValues(positions);
    const bestScore = getBestScoreValues(positions);

    return sortBy(s => s.scores.getRatio(worstScore, bestScore), true)
        .thenBy(s => s.scores.clearingLines, true)
        .thenBy(s => s.scores.holes, false)
        .thenBy(s => s.scores.height, false)
        .execute(positions);
}