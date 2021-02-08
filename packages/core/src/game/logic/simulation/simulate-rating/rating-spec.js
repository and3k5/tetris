import { countHeight, countHoles } from "./";

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