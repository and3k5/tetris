export class Color {
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(r: number, g: number, b: number, a: number) {
        this.r = r; // Red
        this.g = g; // Green
        this.b = b; // Blue
        this.a = a; // Alpha
    }

    add(_r, _g, _b, _a) {
        return new Color(Math.min(255, this.r + _r), this.g + _g, this.b + _b, this.a + _a);
    }

    toRGBAString() {
        return `rgba(${~~this.r},${~~this.g},${~~this.b},${this.a})`;
    }

    toHSLA() {
        // make r, g, and b fractions of 1
        const r = this.r / 255;
        const g = this.g / 255;
        const b = this.b / 255;
        // find greatest and smallest channel values
        const cmin = Math.min(r, g, b);
        const cmax = Math.max(r, g, b);
        const delta = cmax - cmin;
        let h = 0;
        let s = 0;
        let l = 0;

        // calculate hue
        // no difference
        if (delta == 0) h = 0;
        // red is max
        else if (cmax == r) h = ((g - b) / delta) % 6;
        // green is max
        else if (cmax == g) h = (b - r) / delta + 2;
        // blue is max
        else h = (r - g) / delta + 4;

        h = Math.round(h * 60);

        // make negative hues positive behind 360°
        if (h < 0) h += 360;

        // calculate lightness
        l = (cmax + cmin) / 2;

        // calculate saturation
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

        // multiply l and s by 100
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        return { h, s: s / 100, l: l / 100, a: this.a };
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
