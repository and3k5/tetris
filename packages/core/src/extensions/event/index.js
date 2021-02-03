export class EventController {
    #handlers = [];
    #defaultThis = null;
    constructor(defaultThis) {
        this.#defaultThis = defaultThis;
    }

    on(name, handler) {
        this.#handlers.push({
            name,
            handler,
        });
    }

    trigger(name, _this, ...args) {
        if (_this === null) {
            _this = this.#defaultThis;
        }
        for (var event of this.#handlers) {
            if (event.name === name) {
                event.handler.apply(_this, args);
            }
        }
    }
}