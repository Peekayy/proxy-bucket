const HttpProxy = require("./HttpProxy");
const debug = require("debug")("pb.ProxyBucket");
const Store = require("./Store");


module.exports = class ProxyBucket {

    static providers = [
        "ProxyListDotDownload"
    ];

    constructor(providers = ProxyBucket.providers) {
        this._list = [];
        if (!Array.isArray(providers)) {
            providers = [providers];
        }
        this._providers = providers.map(p => {
            try {
                const P = require(`./providers/${p}`);
                return new P();
            } catch (err) {
                debug(`Failed to load provider ${p}`, err);
                return null;
            }
        }).filter(e => e);
        this.bucket = new Store("./bucket.json");
    }

    async fetchAll() {
        const rawList = {};
        for (let provider of this._providers) {
            debug(`Fetching proxies from : ${provider.constructor.url}`);
            const proxies = await provider.fetchList();
            debug(`Got ${proxies.length} proxies`);
            for (let proxy of proxies) {
                rawList[proxy.addr] = proxy;
            }
        }

        debug("Adding new proxies");
        await this.bucket.load();
        const proxies = this.bucket.contents;
        const newProxies = Object.values(rawList);

        while (newProxies.length) {
            let proxy = newProxies.pop();
            if (!proxies[proxy.addr]) {
                proxies[proxy.addr] = proxy;
            }
        }

        this.bucket.persist();

        debug("Sorting proxies");

        this._list = Object.values(proxies).sort(HttpProxy.compare).slice(0, 10);
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
        } else {
            throw new Error("No proxy found...");
        }
    }

    async goodReview(proxy) {
        proxy = this.bucket.contents[proxy.addr];
        if (proxy) {
            proxy.rating++;
            this.bucket.persist();
        }
    }

    async badReview(proxy) {
        proxy = this.bucket.contents[proxy.addr];
        if (proxy) {
            proxy.rating--;
            this.bucket.persist();
        }
    }
};
