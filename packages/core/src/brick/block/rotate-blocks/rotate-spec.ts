/*global describe, expect, it*/
import { rotateRight, rotateLeft, rotateTwice } from "."

describe("rotate-blocks", function () {
    it("rotate as expected", function () {
        const blocks = [
            [false, false, false, false],
            [false, true, false, false],
            [false, true, false, false],
            [false, true, true, false],
        ]

        const expBlocks = [
            [false, false, false, false],
            [true, true, true, false],
            [true, false, false, false],
            [false, false, false, false],
        ]


        const rotatedBlocks = rotateRight(blocks);

        for (const i in expBlocks) {
            for (const j in expBlocks[i]) {
                expect(rotatedBlocks[i][j]).toBe(expBlocks[i][j]);
            }
        }
    })

    it("rotate reversed as expected", function () {
        const blocks = [
            [false, false, false, false],
            [true, true, true, false],
            [true, false, false, false],
            [false, false, false, false],
        ];

        const expBlocks = [
            [false, false, false, false],
            [false, true, false, false],
            [false, true, false, false],
            [false, true, true, false],
        ];


        const rotatedBlocks = rotateLeft(blocks);

        const dot = "XX";
        const empty = "  ";

        const expBlocksStr = expBlocks.map(x => x.map(x => x ? dot : empty).join("")).join("\n");
        const rotatedBlocksStr = rotatedBlocks.map(x => x.map(x => x ? dot : empty).join("")).join("\n");

        expect("\n" + rotatedBlocksStr + "\n").toBe("\n" + expBlocksStr + "\n");
    })

    it("rotate twice as expected", function () {
        const blocks = [
            [false, false, false, false],
            [true, true, true, false],
            [true, false, false, false],
            [false, false, false, false],
        ];

        const expBlocks = [
            [false, false, false, false],
            [false, false, false, true],
            [false, true, true, true],
            [false, false, false, false],
        ];


        const rotatedBlocks = rotateTwice(blocks);

        const dot = "XX";
        const empty = "  ";

        const expBlocksStr = expBlocks.map(x => x.map(x => x ? dot : empty).join("")).join("\n");
        const rotatedBlocksStr = rotatedBlocks.map(x => x.map(x => x ? dot : empty).join("")).join("\n");

        expect("\n" + rotatedBlocksStr + "\n").toBe("\n" + expBlocksStr + "\n");
    })
})