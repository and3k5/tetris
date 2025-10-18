import { Brick } from "@tetris/core/brick";
import { Blocks } from "@tetris/core/brick/brick";
import { utils } from "@tetris/core/utils";

export type StateValue = {
    fromStamp: number;
    scale: number;
    color: utils.color.Color;
    brick: Brick | undefined | null;
    fromX: number;
    fromY: number;
    currentX?: number;
    currentY?: number;
    toX: number;
    toY: number;
    blocks: Blocks;
};
