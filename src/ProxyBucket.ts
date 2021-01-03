import HttpProxy from "./HttpProxy";
import * as DebugFactory from "debug";
import Store from "./Store";
import AbstractProvider from "./providers/AbstractProvider";
import * as shuffle from "lodash.shuffle";

const debug = DebugFactory("pb.ProxyBucket");


export default class ProxyBucket {

    static providers = [
        "ProxyListDotDownload",
        "ProxyScrapeDotCom"
    ];
    private readonly providers: AbstractProvider[];
    private bucket: Store;
    private _list: HttpProxy[];

    constructor(providers = ProxyBucket.providers) {
        this._list = [];
        if (!Array.isArray(providers)) {
            providers = [providers];
        }
        this.providers = providers.map(p => {
            try {
                const P = require(`./providers/${p}`).default;
                return new P();
            } catch (err) {
                debug(`Failed to load provider ${p}`, err);
                return null;
            }
        }).filter(e => e);
        this.bucket = new Store("./bucket.json");
    }

    async fetchAll() {
        let newProxies: HttpProxy[] = [];
        for (let provider of this.providers) {
            debug(`Fetching proxies from : ${provider.constructor['name']}`);
            newProxies.push(...await provider.fetchList());
            debug(`Got ${newProxies.length} proxies`);
        }

        debug("Adding new proxies");
        await this.bucket.load();
        const proxies = this.bucket.contents;

        while (newProxies.length) {
            let proxy = newProxies.pop();
            if (!proxies[proxy.addr]) {
                debug(`${proxy}[${proxy.provider}] added.`);
                proxies[proxy.addr] = proxy;
            }
        }
        this.bucket.persist();
        this._list = shuffle(Object.values(proxies))
            .sort(HttpProxy.compare)
            .slice(0, 10)
            .map(p => new HttpProxy(p.ip, p.port, p.provider, p.rating, p.timeout));
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

    async goodReview(proxy: HttpProxy, mark = 1) {
        proxy = this.bucket.contents[proxy.addr];
        if (proxy) {
            proxy.rating += mark;
            await this.bucket.persist();
        }
    }

    async badReview(proxy: HttpProxy, mark = 1) {
        proxy = this.bucket.contents[proxy.addr];
        if (proxy) {
            proxy.rating -= mark;
            await this.bucket.persist();
        }
    }
}
