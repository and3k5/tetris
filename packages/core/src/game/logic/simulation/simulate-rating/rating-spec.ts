import { countClearingLines, countHeight, countHoles } from "./";

describe("countHoles", function () {
    it("counts properly", function () {
        const matrix = [
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            " x       x",
            "x     x   ",
            "          ",
        ].map((x) => x.split("").map((y) => y === "x"));

        const result = countHoles(matrix);

        expect(result).toBe(6);
    });
});

describe("countHeight", function () {
    it("counts properly", function () {
        const matrix = [
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            "x         ",
            "x         ",
            "xx        ",
            "xx x      ",
            "xxxxx     ",
        ].map((x) => x.split("").map((y) => y === "x"));

        const result = countHeight(matrix);

        expect(result.blocksHeight).toBe(5);
    });
});

describe("countClearingLines", function () {
    it("counts no rows properly", function () {
        const matrix = [
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
        ].map((x) => x.split("").map((y) => y === "x"));

        const result = countClearingLines(matrix);

        expect(result).toBe(0);
    });

    it("counts 1 row properly", function () {
        const matrix = [
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            "xxxxxxxxxx",
        ].map((x) => x.split("").map((y) => y === "x"));

        const result = countClearingLines(matrix);

        expect(result).toBe(1);
    });

    it("counts 2 rows properly", function () {
        const matrix = [
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            "xxxxxxxxxx",
            "xxxxxxxxxx",
        ].map((x) => x.split("").map((y) => y === "x"));

        const result = countClearingLines(matrix);

        expect(result).toBe(2);
    });

    it("counts 3 rows properly", function () {
        const matrix = [
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            "xxxxxxxxxx",
            "xxxxxxxxxx",
            "xxxxxxxxxx",
        ].map((x) => x.split("").map((y) => y === "x"));

        const result = countClearingLines(matrix);

        expect(result).toBe(3);
    });
});
