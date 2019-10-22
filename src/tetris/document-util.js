export default class DocumentUtil {
    #element;
    #reacts = [];
    constructor(element) {
        this.#element = this.parse(element);
    }

    parse(element) {
        if (element instanceof DocumentUtil) {
            return this.parse(element.#element);
        } else if (typeof (element) === "string") {
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
        return new DocumentUtil(this.#element.querySelector(query));
    }

    attr(name, value) {
        if (arguments.length == 1)
            return this.#element.getAttribute(name);
        else
            this.#element.setAttribute(name, value);
        return this;
    }

    append(element) {
        if (element instanceof DocumentUtil) {
            this.#element.appendChild(element.#element);
        } else {
            this.#element.appendChild(this.parse(element));
        }
        return this;
    }

    toString() {
        return this.#element.outerHTML;
    }

    text(txt) {
        if (arguments.length === 0) {
            return this.#element.textContent;
        } else {
            this.#element.textContent = txt;
        }
        return this;
    }

    get el() {
        return this.#element;
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

    react(getter,observe = true) {
        var reactor = new Reactor(getter);
        this.#reacts.push(reactor);
        if (observe === true)
            reactor.observe();
        return reactor;
    }
}

class Reactor {
    #getter;
    #interval = -1;
    #tick;
    #lastValue;
    #handlers = [];
    constructor(getter) {
        this.#getter = getter;

        this.#tick = (function () {
            var currentValue = this.getCurrentValue();
            var lastValue = this.lastValue;
            if (currentValue !== lastValue) {
                this.lastValue = currentValue;
                this.emit();
            }
        }).bind(this);
    }

    get lastValue() {
        return this.#lastValue;
    }

    set lastValue(v) {
        this.#lastValue = v;
    }

    emit() {
        for (var handler of this.#handlers)
            this.invoke(handler);
    }

    addHandler(callback) {
        this.#handlers.push(callback);
        return this;
    }

    invoke(handler) {
        handler(this.lastValue);
    }

    getCurrentValue() {
        return this.#getter();
    }

    observe() {
        if (this.#interval !== -1)
            throw new Error("Is already observing");
        this.#interval = setInterval(this.#tick,100);
    }
}