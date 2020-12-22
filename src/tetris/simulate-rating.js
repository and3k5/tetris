export function countClearingLines(matrix) {
    let clearingLines = 0;
    for (var y = matrix.length - 1; y >= 0; y--) {
        if (matrix[y].filter(x => x !== true).length === 0) {
            clearingLines++;
        }
    }
    return clearingLines;
}

export function countHoles(game, matrix) {
    let holes = 0;
    for (var x = 0; x < game.width; x++) {
        var countingHoles = false;
        for (var y = matrix.length - 1; y >= 0; y--) {
            if (matrix[y][x] === true && countingHoles != true) {
                countingHoles = true;
            }

            if (countingHoles === true && matrix[y][x] !== true && matrix.map(z => z[x]).slice(0, y).filter(f => f).length > 0) {
                holes++;
            }
        }
    }
    return holes;
}

export function countHeight(game, matrix) {
    let height = 0;
    for (var x = 0; x < game.width; x++) {
        var xHeight = 0;
        for (var y = matrix.length - 1; y >= 0; y--) {
            if (matrix[y][x] === true) {
                var currentHeight = matrix.length - y
                if (xHeight < currentHeight)
                    xHeight = currentHeight;
            }
        }
        height += xHeight;
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

export function summaryScore(scores) {
    return (scores.clearingLines * 3) + (scores.holes * -7) + (scores.height * -2) + (scores.holes == 0 ? 2 : 0);
}