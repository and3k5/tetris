export default class DocumentUtil {
    #element;
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
}