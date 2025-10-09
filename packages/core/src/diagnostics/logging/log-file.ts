import { existsSync, readFileSync, writeFileSync } from "fs";

export interface Options {
    path?: string;
    init: unknown;
    object: unknown;
}

export class LogFile {
    options: Options;
    readHandler: () => void;
    writeHandler: () => void;
    json: null | unknown;
    constructor(options: Options) {
        this.options = options;
        this.readHandler = null;
        this.writeHandler = null;
        this.json = null;
        if (typeof options.path === "string") {
            this.initFileHandler(options.path, options.init);
        } else if (typeof options.object != "undefined") {
            this.json = options.object;
        }

        this.readHandler();
        this.watch();
    }

    watch() {
        // oxlint-disable-next-line no-this-alias
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const lf = this;

        const proxySetup = {
            get: function (target, prop) {
                //console.log({ type: 'get', target, prop });
                return Reflect.get(target, prop);
            },
            set: function (target, prop, value) {
                //console.log({ type: 'set', target, prop, value });
                //console.log("set", prop);
                value = Reflect.get(target, prop);
                if (
                    value != null &&
                    typeof value === "object" &&
                    !Object.prototype.isPrototypeOf.call(value, Proxy)
                ) {
                    //console.log("newLink from set");
                    Reflect.set(target, prop, new Proxy(value, proxySetup));
                }
                //target[prop] = value;
                lf.writeHandler();

                return Reflect.set(target, prop, value);
            },
        };

        const proxy = new Proxy(this.json, proxySetup);
        this.json = proxy;
        // Object.observe(this.json,function () {
        //     console.log("change",this,arguments);
        // },["add","update","delete","reconfigure","setPrototype","preventExtensions"]);
    }

    initFileHandler(path, init) {
        this.readHandler = () => {
            if (!existsSync(path)) {
                if (typeof init == "function") {
                    const value = init();
                    writeFileSync(path, JSON.stringify(value));
                }
            }
            const content = readFileSync(path, { encoding: "utf8" });
            this.json = JSON.parse(content);
        };
        this.writeHandler = () => {
            const content = JSON.stringify(this.json);
            writeFileSync(path, content);
        };
    }
}
