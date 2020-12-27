"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class Store {
    constructor(path) {
        this.path = path;
        this.contents = {};
    }
    async load() {
        let contents = await fs.promises.readFile(this.path, { encoding: "utf8", flag: "a+" });
        if (!contents) {
            contents = "{}";
        }
        this.contents = JSON.parse(contents);
    }
    async persist() {
        await fs.promises.writeFile(this.path, JSON.stringify(this.contents));
    }
}
exports.default = Store;
;
//# sourceMappingURL=Store.js.map