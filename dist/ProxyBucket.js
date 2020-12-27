"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpProxy_1 = require("./HttpProxy");
const DebugFactory = require("debug");
const Store_1 = require("./Store");
const debug = DebugFactory("pb.ProxyBucket");
class ProxyBucket {
    constructor(providers = ProxyBucket.providers) {
        this._list = [];
        if (!Array.isArray(providers)) {
            providers = [providers];
        }
        this.providers = providers.map(p => {
            try {
                const P = require(`./providers/${p}`).default;
                return new P();
            }
            catch (err) {
                debug(`Failed to load provider ${p}`, err);
                return null;
            }
        }).filter(e => e);
        this.bucket = new Store_1.default("./bucket.json");
    }
    async fetchAll() {
        let newProxies;
        for (let provider of this.providers) {
            debug(`Fetching proxies from : ${provider.constructor['name']}`);
            newProxies = await provider.fetchList();
            debug(`Got ${newProxies.length} proxies`);
        }
        debug("Adding new proxies");
        await this.bucket.load();
        const proxies = this.bucket.contents;
        while (newProxies.length) {
            let proxy = newProxies.pop();
            if (!proxies[proxy.addr]) {
                debug(`${proxy} added.`);
                proxies[proxy.addr] = proxy;
            }
        }
        this.bucket.persist();
        this._list = Object.values(proxies)
            .sort(HttpProxy_1.default.compare)
            .slice(0, 10);
        debug(this._list);
    }
    async getOne() {
        if (!this._list.length) {
            debug("Empty proxy list, fetching a new one.");
            await this.fetchAll();
        }
        const proxy = this._list.pop();
        debug("Delivering proxy", proxy);
        if (proxy) {
            return proxy;
        }
        else {
            throw new Error("No proxy found...");
        }
    }
    async goodReview(proxy) {
        proxy = this.bucket.contents[proxy.addr];
        if (proxy) {
            proxy.rating++;
            await this.bucket.persist();
        }
    }
    async badReview(proxy) {
        proxy = this.bucket.contents[proxy.addr];
        if (proxy) {
            proxy.rating--;
            await this.bucket.persist();
        }
    }
}
exports.default = ProxyBucket;
ProxyBucket.providers = [
    "ProxyListDotDownload",
    "ProxyScrapeDotCom"
];
;
//# sourceMappingURL=ProxyBucket.js.map