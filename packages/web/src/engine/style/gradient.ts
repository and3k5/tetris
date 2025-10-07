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
    constructor(ctx, a, b, c, d, e, f) {
        super(ctx.createRadialGradient(a, b, c, d, e, f));
    }
}

export class LinearGradient extends Gradient {
    constructor(ctx, a, b, c, d) {
        super(ctx.createLinearGradient(a, b, c, d));
    }
}
