import * as grid from "./graphics-grid.js";
import { RadialGradient, LinearGradient } from "./gradient.js";
import Color from "./color.js";

export const getGrid = grid.getGrid;
export const drawGrid = grid.drawGrid;

export class GraphicsSetup {
    #drawSquare;
    constructor(options) {
        this.#drawSquare = options.drawSquare;
    }
    drawSquare(ctx, x, y, w, h, color) {
        return this.#drawSquare(ctx, x, y, w, h, color);
    }
}

export function defaultGraphics() {
    var graphics = new GraphicsSetup(
        {
            drawSquare(ctx, x, y, w, h, color) {
                var fstyle = new RadialGradient(ctx, x + (w / 2), y + (h / 2), 0, x + (w / 2), y + (h / 2), 40);
                fstyle.addColor(0, color);
                fstyle.addColor(1, color.alphaScale(0.5));
                ctx.fillStyle = fstyle.compile();
                ctx.fillRect(x, y, w, h);

                var fstyle = new LinearGradient(ctx, x + (w / 2), y, x + (w / 2), y + h);
                fstyle.addColor(0.2, color.alpha(0.5));
                fstyle.addColor(0, Color.Black().alpha(0.9));
                ctx.fillStyle = fstyle.compile();
                ctx.fillRect(x, y, w, h);

                var fstyle = new LinearGradient(ctx, x, y + (h / 2), x + w, y + (h / 2));
                fstyle.addColor(0.3, color.scale(0.7).alpha(0));
                fstyle.addColor(0, Color.Black().alpha(0.4));
                ctx.fillStyle = fstyle.compile();
                ctx.fillRect(x, y, w, h);

                var fstyle = new LinearGradient(ctx, x + (w / 2), y, x + (w / 2), y + h);
                fstyle.addColor(0.8, color.scale(0.1).alpha(0));
                fstyle.addColor(1, Color.Black());
                ctx.fillStyle = fstyle.compile();
                ctx.fillRect(x, y, w, h);

                var fstyle = new LinearGradient(ctx, x, y + (h / 2), x + w, y + (h / 2));
                fstyle.addColor(0.8, color.scale(0.2).alpha(0));
                fstyle.addColor(1, Color.Black());
                ctx.fillStyle = fstyle.compile();
                ctx.fillRect(x, y, w, h);
            }
        }
    );

    return graphics;
}