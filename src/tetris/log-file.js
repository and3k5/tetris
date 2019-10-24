export class LogFile {
    constructor(options) {
        this.options = options;
        this.readHandler = null;
        this.writeHandler = null;
        this.json = null;
        if (typeof(options.path) === "string") {
            this.initFileHandler(options.path,options.init);
        }else if (typeof(options.object) != "undefined") {
            this.json = options.object;
        }
    }

    watch() {
        Object.observe(this.json,function () {
            console.log("change",this,arguments);
        },["add","update","delete","reconfigure","setPrototype","preventExtensions"]);
    }

    initFileHandler(path,init) {
        const fs = require("fs");
        this.readHandler = function () {
            if (!fs.exists(path)) {
                if (typeof(init) == "function") {
                    var value = init();
                    fs.writeFileSync(path, JSON.stringify(value));
                }
            }
            var content = fs.readFileSync(path);
            this.json = JSON.parse(content);
        };
        this.writeHandler = function () {
            var content = JSON.stringify(this.json);
            fs.writeFileSync(path, content);
        }
    }
}