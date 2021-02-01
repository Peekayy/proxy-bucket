import * as fs from "fs";
import {HttpProxy} from "./HttpProxy";
import * as AsyncLock from "async-lock"

export default class Store {
    private readonly path: string;
    private readonly semaphore = new AsyncLock();
    public contents: { [key: string]: HttpProxy };

    constructor(path: string) {
        this.path = path;
        this.contents = {};
    }

    async load(): Promise<void> {
        let contents = await this.semaphore.acquire("storeLock", () => {
            return fs.promises.readFile(this.path, {encoding: "utf8", flag: "a+"});
        });
        if (!contents) {
            contents = "{}";
        }
        this.contents = JSON.parse(contents);
    }

    async persist(): Promise<void> {
        await this.semaphore.acquire("storeLock", () => {
            return fs.promises.writeFile(this.path, JSON.stringify(this.contents));
        });
    }
};
