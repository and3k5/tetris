const cache = [];
class CacheKey {
    private _color;
    private _width;
    private _height;
    private _countX;
    private _countY;
    constructor(color, gridWidth, gridHeight, countX, countY) {
        this._color = color;
        this._width = gridWidth;
        this._height = gridHeight;
        this._countX = countX;
        this._countY = countY;
    }

    get key() {
        return (
            "C:" +
            this._color.toRGBAString() +
            "W:" +
            this._width +
            "H:" +
            this._height +
            "X:" +
            this._countX +
            "Y:" +
            this._countY
        );
    }

    matches(b) {
        return this.key === b.key;
    }
}

export function getGrid(color, gridWidth, gridHeight, countX, countY) {
    const key = new CacheKey(color, gridWidth, gridHeight, countX, countY);
    const match = cache.filter((c) => key.matches(c.key));
    if (match.length > 0) return match[0].data;
    const newObj = { key, data: createGrid(color, gridWidth, gridHeight, countX, countY) };
    cache.push(newObj);
    return newObj.data;
}

function createGrid(color, gridWidth, gridHeight, countX, countY) {
    const canvas = new OffscreenCanvas(gridWidth * countX, gridHeight * countY);
    // canvas.width = gridWidth * countX;
    // canvas.height = gridHeight * countY;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = color.toRGBAString();
    ctx.lineWidth = 2;

    for (let x = 0; x <= countX; x++) {
        ctx.beginPath();
        ctx.moveTo(x * gridWidth, 0);
        ctx.lineTo(x * gridWidth, canvas.height);
        ctx.closePath();
        ctx.stroke();
    }

    for (let y = 0; y <= countY; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * gridHeight);
        ctx.lineTo(canvas.width, y * gridHeight);
        ctx.closePath();
        ctx.stroke();
    }

    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export function drawGrid(ctx, color, gridWidth, gridHeight, countX, countY) {
    const imageData = getGrid(color, gridWidth, gridHeight, countX, countY);
    ctx.putImageData(imageData, 0, 0);
}
