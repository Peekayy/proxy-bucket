const fs = require("fs").promises;

module.exports = class Store {

    constructor(path) {
        this.path = path;
        this.contents = {};
    }

    async load() {
        let contents = await fs.readFile(this.path, {encoding: "utf8", flag: "w+"});
        if (!contents) {
            contents = "{}";
        }
        this.contents = JSON.parse(contents);
    }

    async persist() {
        await fs.writeFile(this.path, JSON.stringify(this.contents));
    }
};
