import DocumentUtil from "../../utils/document-util";

var cache = [];
class CacheKey {
    #color;
    #width;
    #height;
    #countX;
    #countY;
    constructor(color, gridWidth, gridHeight, countX, countY) {
        this.#color = color;
        this.#width = gridWidth;
        this.#height = gridHeight;
        this.#countX = countX;
        this.#countY = countY;
    }

    get key() {
        return "C:" + this.#color.toRGBAString() + "W:" + this.#width + "H:" + this.#height + "X:" + this.#countX + "Y:" + this.#countY;
    }

    matches(b) {
        return this.key === b.key;
    }
}

export function getGrid(color, gridWidth, gridHeight, countX, countY) {
    var key = new CacheKey(color, gridWidth, gridHeight, countX, countY);
    var match = cache.filter(c => key.matches(c.key));
    if (match.length > 0)
        return match[0].data;
    var newObj = { key };
    newObj.data = createGrid(color, gridWidth, gridHeight, countX, countY);
    cache.push(newObj);
    return newObj.data;
}

function createGrid(color, gridWidth, gridHeight, countX, countY) {
    var canvas = new DocumentUtil("canvas").el;
    canvas.width = gridWidth * countX;
    canvas.height = gridHeight * countY;
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = color.toRGBAString();
    ctx.lineWidth = 2;

    for (var x = 0; x <= countX; x++) {
        ctx.beginPath();
        ctx.moveTo(x * gridWidth, 0);
        ctx.lineTo(x * gridWidth, canvas.height);
        ctx.closePath();
        ctx.stroke();
    }

    for (var y = 0; y <= countY; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * gridHeight, 0);
        ctx.lineTo(canvas.width, y * gridHeight);
        ctx.closePath();
        ctx.stroke();
    }

    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export function drawGrid(ctx, color, gridWidth, gridHeight, countX, countY) {
    var imageData = getGrid(color, gridWidth, gridHeight, countX, countY);
    ctx.putImageData(imageData, 0, 0);
}