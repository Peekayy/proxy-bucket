import * as fs from "fs";
import {HttpProxy} from "./HttpProxy";

export default class Store {
    private readonly path: string;
    public contents: { [key: string]: HttpProxy };

    constructor(path: string) {
        this.path = path;
        this.contents = {};
    }

    async load(): Promise<void> {
        let contents = await fs.promises.readFile(this.path, {encoding: "utf8", flag: "a+"});
        if (!contents) {
            contents = "{}";
        }
        this.contents = JSON.parse(contents);
    }

    async persist(): Promise<void> {
        await fs.promises.writeFile(this.path, JSON.stringify(this.contents));
    }
};
