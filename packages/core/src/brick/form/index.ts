export class BrickFormBase {
    constructor() {

    }

    getBrickForm() {
        throw new Error("missing implementation")
    }
}

export class SimpleBrickForm extends BrickFormBase {
    #form;
    constructor(form) {
        super();
        this.#form = form;
    }
    getBrickForm() {
        return JSON.parse(JSON.stringify(this.#form));
    }
}

export class BinaryBrickForm extends BrickFormBase {
    #value;
    #size;
    constructor(value, size) {
        if (!(size > 0))
            throw new Error("Size must be more than 0");
        super();
        this.#value = value;
        this.#size = size;
    }
    getBrickForm() {
        var size = this.#size;
        var mask = 0;
        for (let i = 0; i < size; i++) {
            mask = mask << 1;
            mask |= 0b1;
        }

        var form = [[]];

        var temp = this.#value;

        for (let i = 0; i < size * size; i++) {
            var block = 0;
            if ((temp & 1) === 1) {
                block = 1;
            }
            if (form[0].length == size) {
                form.splice(0, 0, []);
            }
            var line = form[0];
            line.splice(0, 0, block);
            temp = temp >> 1;
        }

        return form;
    }
}