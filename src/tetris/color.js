class Color {
    constructor(r, g, b, a) {
        this.r = r; // Red
        this.g = g; // Green
        this.b = b; // Blue
        this.a = a; // Alpha
    }

    add(_r, _g, _b, _a) {
        return (new Color(Math.min(255, (this.r + _r)), this.g + _g, this.b + _b, this.a + _a))
    }

    toRGBAString() {
        return `rgba(${parseInt(this.r)},${parseInt(this.g)},${parseInt(this.b)},${parseFloat(this.a)})`;
    }

    setAlpha(a) {
        this.a = a;
        return this;
    }

    alpha(a) {
        return this.copy().setAlpha(a);
    }

    setAlphaScale(s) {
        this.a = this.a * s;
        return this;
    }

    alphaScale(s) {
        return this.copy().setAlphaScale(s);
    }

    setScale(s) {
        this.r *= s;
        this.g *= s;
        this.b *= s;
        return this;
    }

    scale(s) {
        return this.copy().setScale(s);
    }

    copy() {
        return new Color(this.r, this.g, this.b, this.a);
    }

    static Black() {
        return new Color(0, 0, 0, 1);
    }
}

export default Color