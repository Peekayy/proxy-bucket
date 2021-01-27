import {HttpProxy} from "./HttpProxy";
import * as DebugFactory from "debug";
import Store from "./Store";
import AbstractProvider from "./providers/AbstractProvider";
import * as shuffle from "lodash.shuffle";

const debug = DebugFactory("pb.ProxyBucket");


export class ProxyBucket {

    static providers = [
        "ProxyListDotDownload",
        "PubProxyDotCom"
    ];
    private readonly providers: AbstractProvider[];
    private bucket: Store;
    private _list: HttpProxy[];
    private ongoingFetchPromise: Promise<void>;

    constructor(providers = ProxyBucket.providers, private lockDurationSeconds = 3600) {
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

    private async internalFetchAll() {
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
        await this.bucket.persist();
        const now = Date.now();
        this._list = shuffle(Object.values(proxies))
            .filter(p => !p.lock || p.lock < now)
            .sort(HttpProxy.compare)
            .slice(0, 10)
            .map(p => new HttpProxy(p.ip, p.port, p.provider, p.rating, p.timeout, p.protocol));
        debug(this._list);
    }

    async fetchAll() {
        if (this.ongoingFetchPromise) {
            await this.ongoingFetchPromise;
        } else {
            this.ongoingFetchPromise = this.internalFetchAll();
            await this.ongoingFetchPromise;
            this.ongoingFetchPromise = null;
        }
    }

    async getOne() {
        if (!this._list.length) {
            debug("Empty proxy list, fetching a new one.");
            await this.fetchAll();
        }

        const proxy = this._list.pop();
        debug("Delivering proxy", proxy);
        if (proxy) {
            await this.lock(proxy);
            return proxy;
        } else {
            throw new Error("No proxy found...");
        }
    }

    async lock(proxy: HttpProxy) {
        proxy = this.bucket.contents[proxy.addr];
        if (proxy) {
            proxy.lock = Date.now() + this.lockDurationSeconds * 1000;
            await this.bucket.persist();
        }
    }

    async unlock(proxy: HttpProxy) {
        proxy = this.bucket.contents[proxy.addr];
        if (proxy) {
            delete proxy.lock;
            await this.bucket.persist();
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
