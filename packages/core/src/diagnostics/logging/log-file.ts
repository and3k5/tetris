export class LogFile {
    constructor(options) {
        this.options = options;
        this.readHandler = null;
        this.writeHandler = null;
        this.json = null;
        if (typeof (options.path) === "string") {
            this.initFileHandler(options.path, options.init);
        } else if (typeof (options.object) != "undefined") {
            this.json = options.object;
        }

        this.readHandler();
        this.watch();
    }

    watch() {
        const lf = this;

        var proxySetup = {
            get: function (target, prop) {
                //console.log({ type: 'get', target, prop });
                return Reflect.get(target, prop);
                let value = Reflect.get(target, prop);
                if (typeof (value) === "function" || prop === "toJSON")
                    return Reflect.get(target, prop);

                console.log("get", prop);
                value = Reflect.get(target, prop);
                if (value != null && typeof (value) === "object" && !value.isPrototypeOf(Proxy)) {
                    console.log("newLink from get");
                    Reflect.set(target, prop, new Proxy(value, proxySetup));
                    //value = new Proxy(value,proxySetup);
                }
                //console.log("read");
                //console.log(target === lf.json);
                //console.log(lf.json.isPrototypeOf(Proxy));
                return Reflect.get(target, prop);
            },
            set: function (target, prop, value) {
                //console.log({ type: 'set', target, prop, value });
                //console.log("set", prop);
                value = Reflect.get(target, prop);
                if (value != null && typeof (value) === "object" && !value.isPrototypeOf(Proxy)) {
                    //console.log("newLink from set");
                    Reflect.set(target, prop, new Proxy(value, proxySetup));
                }
                //target[prop] = value;
                lf.writeHandler();

                return Reflect.set(target, prop, value);
            }
        };

        const proxy = new Proxy(this.json, proxySetup);
        this.json = proxy;
        // Object.observe(this.json,function () {
        //     console.log("change",this,arguments);
        // },["add","update","delete","reconfigure","setPrototype","preventExtensions"]);
    }

    initFileHandler(path, init) {
        const fs = require("fs");
        this.readHandler = function () {
            if (!fs.existsSync(path)) {
                if (typeof (init) == "function") {
                    const value = init();
                    fs.writeFileSync(path, JSON.stringify(value));
                }
            }
            const content = fs.readFileSync(path);
            this.json = JSON.parse(content);
        };
        this.writeHandler = function () {
            //console.log("file write");
            const content = JSON.stringify(this.json);
            fs.writeFileSync(path, content);
        }
    }
}