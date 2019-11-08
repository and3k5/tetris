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

    toHSLA() {
        var r = this.r / 255;
        var g = this.r / 255;
        var b = this.r / 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return { h, s, l, a: this.a };
    }

    setInvert() {
        this.r = 255 - this.r;
        this.g = 255 - this.g;
        this.b = 255 - this.b;
        return this;
    }

    invert() {
        return this.copy().setInvert();
    }

    setAlpha(a) {
        this.a = a;
        return this;
    }

    alpha(a) {
        return this.copy().setAlpha(a);
    }

    setBrightness(b) {
        this.r = this.r * b;
        this.g = this.g * b;
        this.b = this.b * b;
        return this;
    }

    brightness(b) {
        return this.copy().setBrightness(b);
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