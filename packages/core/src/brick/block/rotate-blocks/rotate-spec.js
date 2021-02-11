/*global describe, expect, it*/
import { rotateRight, rotateLeft, rotateTwice } from "."

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


        var rotatedBlocks = rotateRight(blocks);

        for (var i in expBlocks) {
            for (var j in expBlocks[i]) {
                expect(rotatedBlocks[i][j]).toBe(expBlocks[i][j]);
            }
        }
    })

    it("rotate reversed as expected", function () {
        var blocks = [
            [false, false, false, false],
            [true, true, true, false],
            [true, false, false, false],
            [false, false, false, false],
        ];

        var expBlocks = [
            [false, false, false, false],
            [false, true, false, false],
            [false, true, false, false],
            [false, true, true, false],
        ];


        var rotatedBlocks = rotateLeft(blocks);

        const dot = "XX";
        const empty = "  ";

        var expBlocksStr = expBlocks.map(x => x.map(x => x ? dot : empty).join("")).join("\n");
        var rotatedBlocksStr = rotatedBlocks.map(x => x.map(x => x ? dot : empty).join("")).join("\n");

        expect("\n" + rotatedBlocksStr + "\n").toBe("\n" + expBlocksStr + "\n");
    })

    it("rotate twice as expected", function () {
        var blocks = [
            [false, false, false, false],
            [true, true, true, false],
            [true, false, false, false],
            [false, false, false, false],
        ];

        var expBlocks = [
            [false, false, false, false],
            [false, false, false, true],
            [false, true, true, true],
            [false, false, false, false],
        ];


        var rotatedBlocks = rotateTwice(blocks);

        const dot = "XX";
        const empty = "  ";

        var expBlocksStr = expBlocks.map(x => x.map(x => x ? dot : empty).join("")).join("\n");
        var rotatedBlocksStr = rotatedBlocks.map(x => x.map(x => x ? dot : empty).join("")).join("\n");

        expect("\n" + rotatedBlocksStr + "\n").toBe("\n" + expBlocksStr + "\n");
    })
})