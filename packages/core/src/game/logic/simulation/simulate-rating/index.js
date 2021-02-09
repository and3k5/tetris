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

export function getScores(game, matrix) {
    const clearingLines = countClearingLines(matrix);
    const holes = countHoles(game, matrix);
    const height = countHeight(game, matrix);

    return {
        holes,
        height,
        clearingLines,
    };
}

export function sortMovements(positions) {
    return sortBy(s => s.scores.clearingLines, true)
        .thenBy(s => s.scores.holes, false)
        .thenBy(s => s.scores.height, false)
        .execute(positions);
}

export function summaryScore(scores) {
    throw new Error("Deprecated");
    return (scores.clearingLines * 3) + (scores.holes * -7) + (scores.height * -2) + (scores.holes == 0 ? 2 : 0);
}