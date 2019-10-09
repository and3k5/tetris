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

    copy() {
        return new Color(this.r, this.g, this.b, this.a);
    }
}

export default Color