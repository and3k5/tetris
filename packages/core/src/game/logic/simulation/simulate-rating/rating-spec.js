/*global describe, expect, it*/
import { countClearingLines, countHeight, countHoles } from "./";

describe("countHoles", function () {
    it("counts properly", function () {
        var matrix = [
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
        ].map(x => x.split("").map(y => y === "x"));

        var result = countHoles({ width: 10, height: 10 }, matrix);

        expect(result).toBe(6);
    });
})

describe("countHeight", function () {
    it("counts properly", function () {
        var matrix = [
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
        ].map(x => x.split("").map(y => y === "x"));

        var result = countHeight({ width: 10, height: 10 }, matrix);

        expect(result).toBe(5);
    });
})

describe("countClearingLines", function () {
    it("counts no rows properly", function () {
        var matrix = [
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
        ].map(x => x.split("").map(y => y === "x"));

        var result = countClearingLines(matrix);

        expect(result).toBe(0);
    });

    it("counts 1 row properly", function () {
        var matrix = [
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
        ].map(x => x.split("").map(y => y === "x"));

        var result = countClearingLines(matrix);

        expect(result).toBe(1);
    });

    it("counts 2 rows properly", function () {
        var matrix = [
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
        ].map(x => x.split("").map(y => y === "x"));

        var result = countClearingLines(matrix);

        expect(result).toBe(2);
    });

    it("counts 3 rows properly", function () {
        var matrix = [
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
        ].map(x => x.split("").map(y => y === "x"));

        var result = countClearingLines(matrix);

        expect(result).toBe(3);
    });
})