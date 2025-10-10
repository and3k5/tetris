export function createReactor(getter: unknown, observe = true) {
    const reactor = new Reactor(getter);
    this._reacts.push(reactor);
    if (observe === true) reactor.observe();
    return reactor;
}

class Reactor {
    private _getter;
    private _interval = -1;
    private _tick;
    private _lastValue;
    private _handlers = [];
    constructor(getter) {
        this._getter = getter;

        this._tick = function () {
            const currentValue = this.getCurrentValue();
            const lastValue = this.lastValue;
            if (currentValue !== lastValue) {
                this.lastValue = currentValue;
                this.emit();
            }
        }.bind(this);
    }

    get lastValue() {
        return this._lastValue;
    }

    set lastValue(v) {
        this._lastValue = v;
    }

    emit() {
        for (const handler of this._handlers) this.invoke(handler);
    }

    addHandler(callback) {
        this._handlers.push(callback);
        return this;
    }

    invoke(handler) {
        handler(this.lastValue);
    }

    getCurrentValue() {
        return this._getter();
    }

    observe() {
        if (this._interval !== -1) throw new Error("Is already observing");
        this._interval = window.setInterval(this._tick, 100);
    }
}
