export default class DocumentUtil {
    private _element;
    private _reacts = [];
    constructor(element) {
        this._element = this.parse(element);
    }

    parse(element) {
        if (element instanceof DocumentUtil) {
            return this.parse(element._element);
        } else if (typeof element === "string") {
            element = element.trim();
            if (element.indexOf("<") !== -1) {
                return DocumentUtil.stringToElement(element);
            } else {
                return document.createElement(element);
            }
        }

        return element;
    }

    querySelector(query) {
        return new DocumentUtil(this._element.querySelector(query));
    }

    attr(name, value) {
        if (arguments.length == 1) return this._element.getAttribute(name);
        else this._element.setAttribute(name, value);
        return this;
    }

    append(element) {
        if (Array.isArray(element)) {
            for (var item of element) this.append(item);
        } else if (element instanceof DocumentUtil) {
            this._element.appendChild(element._element);
        } else {
            this._element.appendChild(this.parse(element));
        }
        return this;
    }

    toString() {
        return this._element.outerHTML;
    }

    text(txt) {
        if (arguments.length === 0) {
            return this._element.textContent;
        } else {
            this._element.textContent = txt;
        }
        return this;
    }

    get el() {
        return this._element;
    }

    static stringToElement(str, parent) {
        var container = document.createElement(parent || "div");
        container.innerHTML = str;
        var result = [];
        for (var i = 0; i < container.children.length; i++) {
            result.push(container.children[i]);
        }
        return result.length === 1 ? result[0] : result;
    }

    react(getter, observe = true) {
        var reactor = new Reactor(getter);
        this._reacts.push(reactor);
        if (observe === true) reactor.observe();
        return reactor;
    }
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
            var currentValue = this.getCurrentValue();
            var lastValue = this.lastValue;
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
        for (var handler of this._handlers) this.invoke(handler);
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
        this._interval = setInterval(this._tick, 100);
    }
}
