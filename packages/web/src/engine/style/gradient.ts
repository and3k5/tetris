class Gradient {
    private _gradient;
    constructor(gradient) {
        this._gradient = gradient;
    }

    addColor(pos, color) {
        this._gradient.addColorStop(pos, color.toRGBAString());
    }

    compile() {
        return this._gradient;
    }
}

export class RadialGradient extends Gradient {
    constructor(
        ctx: CanvasRenderingContext2D,
        ...radialArgs: Parameters<(typeof ctx)["createRadialGradient"]>
    ) {
        const invalidArgs = radialArgs
            .map((x, i) => ({ x, i }))
            .filter((x) => typeof x.x != "number");
        if (invalidArgs.length > 0) {
            throw new Error(
                "Args at " + invalidArgs.map((x) => x.i).join(", ") + " is not numbers",
            );
        }
        const [a, b, c, d, e, f] = radialArgs;
        super(ctx.createRadialGradient(a, b, c, d, e, f));
    }
}

export class LinearGradient extends Gradient {
    constructor(
        ctx: CanvasRenderingContext2D,
        ...linearArgs: Parameters<(typeof ctx)["createLinearGradient"]>
    ) {
        const invalidArgs = linearArgs
            .map((x, i) => ({ x, i }))
            .filter((x) => typeof x.x != "number");
        if (invalidArgs.length > 0) {
            throw new Error(
                "Args at " + invalidArgs.map((x) => x.i).join(", ") + " is not numbers",
            );
        }
        const [a, b, c, d] = linearArgs;
        super(ctx.createLinearGradient(a, b, c, d));
    }
}
