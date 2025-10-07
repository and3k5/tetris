export class BrickFormBase {
    constructor() {}

    getBrickForm() {
        throw new Error("missing implementation");
    }
}

export class SimpleBrickForm extends BrickFormBase {
    private _form;
    constructor(form) {
        super();
        this._form = form;
    }
    getBrickForm() {
        return JSON.parse(JSON.stringify(this._form));
    }
}

export class BinaryBrickForm extends BrickFormBase {
    private _value;
    private _size;
    constructor(value, size) {
        if (!(size > 0)) throw new Error("Size must be more than 0");
        super();
        this._value = value;
        this._size = size;
    }
    getBrickForm() {
        const size = this._size;
        let mask = 0;
        for (let i = 0; i < size; i++) {
            mask = mask << 1;
            mask |= 0b1;
        }

        const form = [[]];

        let temp = this._value;

        for (let i = 0; i < size * size; i++) {
            let block = 0;
            if ((temp & 1) === 1) {
                block = 1;
            }
            if (form[0].length == size) {
                form.splice(0, 0, []);
            }
            const line = form[0];
            line.splice(0, 0, block);
            temp = temp >> 1;
        }

        return form;
    }
}
