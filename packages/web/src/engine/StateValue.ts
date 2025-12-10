import { Blocks, Brick } from "@tetris/core/brick/brick";
import { Color } from "@tetris/core/utils/color";

export type StateValue = {
    fromStamp: number;
    scale: number;
    color: Color;
    brick: Brick | undefined | null;
    fromX: number;
    fromY: number;
    currentX?: number;
    currentY?: number;
    toX: number;
    toY: number;
    blocks: Blocks;
};
