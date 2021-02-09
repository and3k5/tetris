/*global describe, expect, it*/
import { calcRotatedBlocks } from "."

describe("rotate-blocks", function () {
    it("rotate as expected", function () {
        var blocks = [
            [false, false, false, false],
            [false, true, false, false],
            [false, true, false, false],
            [false, true, true, false],
        ]

        var expBlocks = [
            [false, false, false, false],
            [true, true, true, false],
            [true, false, false, false],
            [false, false, false, false],
        ]


        var rotatedBlocks = calcRotatedBlocks(blocks);

        for (var i in expBlocks) {
            for (var j in expBlocks[i]) {
                expect(rotatedBlocks[i][j]).toBe(expBlocks[i][j]);
            }
        }
    })
})