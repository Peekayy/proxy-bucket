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
        let newProxies;
        for (let provider of this._providers) {
            debug(`Fetching proxies from : ${provider.constructor.url}`);
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
            .sort(HttpProxy.compare)
            .slice(0, 10)
            .map(proxy => {
                if (proxy instanceof HttpProxy) {
                    return proxy;
                } else {
                    return new HttpProxy(proxy.ip, proxy.port, proxy.rating);
                }
            });
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
};
