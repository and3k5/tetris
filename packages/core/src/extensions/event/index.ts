export class EventController {
    private _handlers = [];
    private _defaultThis = null;
    constructor(defaultThis) {
        this._defaultThis = defaultThis;
    }

    on(name, handler) {
        this._handlers.push({
            name,
            handler,
        });
    }

    trigger(name, _this, ...args) {
        if (_this === null) {
            _this = this._defaultThis;
        }
        for (var event of this._handlers) {
            if (event.name === name) {
                event.handler.apply(_this, args);
            }
        }
    }
}
