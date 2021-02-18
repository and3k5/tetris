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

export function countHoles(game, matrix) {
    let holes = 0;

    matrix = swapXY(matrix);

    for (var x = 0; x < game.width; x++) {
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

export function countHeight(game, matrix) {
    let height = 0;

    matrix = swapXY(matrix);

    for (var x = 0; x < game.width; x++) {
        var index = matrix[x].indexOf(true);
        if (index < 0)
            continue;
        var xHeight = game.height - index;

        if (xHeight > height)
            height = xHeight;
    }
    return height;
}

export class Score {
    constructor({ clearingLines, holes, height }) {
        this.clearingLines = clearingLines;
        this.holes = holes;
        this.height = height;
    }
}

export function getScores(game, matrix) {
    const clearingLines = countClearingLines(matrix);
    const holes = countHoles(game, matrix);
    const height = countHeight(game, matrix);

    return new Score({
        holes,
        height,
        clearingLines,
    });
}

export function rate(worstScore, bestScore, currentScore, fieldName) {
    const worst = worstScore[fieldName];
    const best = bestScore[fieldName];
    const current = currentScore[fieldName];

    return ratioValue(worst, best, current);
}

export function ratioValue(worst, best, current) {
    if (worst == best)
        return 1;

    let result = (current - worst) / (best - worst)

    return result;
}

/**
 * 
 * @param {Score} score 
 * @param {Score} worstScore 
 * @param {Score} bestScore 
 */
function summaryScore(score, worstScore, bestScore) {
    var scoreItems = [];
    // 1 = 100% = good
    // 0 = 0% = bad

    scoreItems.push(rate(worstScore, bestScore, score, "clearingLines", true));
    scoreItems.push(rate(worstScore, bestScore, score, "holes", false));
    scoreItems.push(rate(worstScore, bestScore, score, "height", false));

    const count = scoreItems.length;
    const summary = scoreItems.reduce((a, b) => a + b, 0);

    return summary / count;
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

    return sortBy(s => summaryScore(s.scores, worstScore, bestScore), true)
        .thenBy(s => s.scores.clearingLines, true)
        .thenBy(s => s.scores.holes, false)
        .thenBy(s => s.scores.height, false)
        .execute(positions);
}