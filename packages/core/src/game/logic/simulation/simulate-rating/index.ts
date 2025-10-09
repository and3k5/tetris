import { Blocks } from "../../../../brick/brick";
import { sortBy } from "../../../../utils/sorting";
import { SimpleMovement } from "../movement";

export function countClearingLines(matrix: Blocks) {
    let clearingLines = 0;
    for (let y = matrix.length - 1; y >= 0; y--) {
        if (matrix[y].filter((x: boolean) => x !== true).length === 0) {
            clearingLines++;
        }
    }
    return clearingLines;
}

function swapXY(matrix: Blocks) {
    const aLength = matrix.length;
    const bLength = matrix[0].length;

    const result = [];

    while (result.length < bLength) {
        const row = [];
        while (row.length < aLength) {
            row.push(undefined);
        }
        result.push(row);
    }

    for (let a = 0; a < aLength; a++) {
        for (let b = 0; b < bLength; b++) {
            result[b][a] = matrix[a][b];
        }
    }

    return result;
}

export function countHoles(matrix: Blocks) {
    let holes = 0;

    matrix = swapXY(matrix);

    for (let x = 0; x < matrix.length; x++) {
        const topBlockIndex = matrix[x].indexOf(true);

        if (topBlockIndex === -1) continue;

        for (let y = topBlockIndex; y < matrix[x].length; y++) {
            if (matrix[x][y] === false) holes++;
        }
    }
    return holes;
}

export function countHeight(matrix: Blocks) {
    let height = 0;

    matrix = swapXY(matrix);

    let gameHeight: null | number = null;

    for (let x = 0; x < matrix.length; x++) {
        const col = matrix[x];
        if (gameHeight == null) gameHeight = col.length;
        const index = col.indexOf(true);
        if (index < 0) continue;
        const xHeight = col.length - index;

        if (xHeight > height) height = xHeight;
    }
    return { blocksHeight: height, gameHeight };
}

export class Score {
    clearingLines: number;
    holes: number;
    height: { blocksHeight: number; gameHeight: number | null };
    constructor({ clearingLines, holes, height }) {
        this.clearingLines = clearingLines;
        this.holes = holes;
        this.height = height;
    }

    getRatio(worstScore: Score, bestScore: Score) {
        const clearingLinesRatio = ratioValue(
            worstScore.clearingLines,
            bestScore.clearingLines,
            this.clearingLines,
        );
        const holesRatio = ratioValue(worstScore.holes, bestScore.holes, this.holes);
        //const heightRatio = ratioValue(worstScore.height, bestScore.height, this.height);
        const heightRatio = 1 - this.height.blocksHeight / this.height.gameHeight;

        return (clearingLinesRatio * 2 + holesRatio * 3 + heightRatio) / 6;
    }
}

export function getScore(matrix: Blocks) {
    const clearingLines = countClearingLines(matrix);
    const holes = countHoles(matrix);
    const height = countHeight(matrix);

    return new Score({
        holes,
        height,
        clearingLines,
    });
}

export function ratioValue(worst: number, best: number, current: number) {
    if (worst == best) return 1;

    const result = (current - worst) / (best - worst);

    return result;
}

function getWorstScoreValues(positions: Movement[]) {
    positions = positions.concat();
    const clearingLines = sortBy<Movement>((s) => s.scores.clearingLines, false).execute(
        positions,
    )[0].scores.clearingLines;
    const height = sortBy<(typeof positions)[number]>(
        (s) => s.scores.height.blocksHeight / s.scores.height.gameHeight,
        true,
    ).execute(positions)[0].scores.height;
    const holes = sortBy<(typeof positions)[number]>((s) => s.scores.holes, true).execute(
        positions,
    )[0].scores.holes;
    return new Score({ clearingLines, holes, height });
}

function getBestScoreValues(positions: Movement[]) {
    positions = positions.concat();
    const clearingLines = sortBy<Movement>((s) => s.scores.clearingLines, true).execute(
        positions,
    )[0].scores.clearingLines;
    const height = sortBy<(typeof positions)[number]>(
        (s) => s.scores.height.blocksHeight / s.scores.height.gameHeight,
        false,
    ).execute(positions)[0].scores.height;
    const holes = sortBy<(typeof positions)[number]>((s) => s.scores.holes, false).execute(
        positions,
    )[0].scores.holes;
    return new Score({ clearingLines, holes, height });
}

export type Movement = SimpleMovement & { scores: Score };

export function sortMovements(positions: Movement[]) {
    const worstScore = getWorstScoreValues(positions);
    const bestScore = getBestScoreValues(positions);

    return sortBy<Movement>((s) => s.scores.getRatio(worstScore, bestScore), true)
        .thenBy((s) => s.scores.clearingLines, true)
        .thenBy((s) => s.scores.holes, false)
        .thenBy((s) => s.scores.height, false)
        .execute(positions);
}
