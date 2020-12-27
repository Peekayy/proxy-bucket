"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise-native");
const HttpProxy_1 = require("../HttpProxy");
const DebugFactory = require("debug");
const AbstractProvider_1 = require("./AbstractProvider");
const debug = DebugFactory("pb.providers.ProxyScrapeDotCom");
class ProxyScrapeDotCom extends AbstractProvider_1.default {
    async fetchList() {
        let rawList;
        try {
            rawList = await request(ProxyScrapeDotCom.url);
            debug(rawList);
            return rawList.split("\r\n")
                .filter(p => p)
                .map(p => p.split(":"))
                .map(p => new HttpProxy_1.default(p[0], p[1], ProxyScrapeDotCom.name));
        }
        catch (err) {
            debug(`Failed to get proxies list : ${err.message}`);
            return [];
        }
    }
}
exports.default = ProxyScrapeDotCom;
ProxyScrapeDotCom.url = "https://api.proxyscrape.com/?request=getproxies&proxytype=http&timeout=10000&country=all&ssl=no&anonymity=elite&format=normal";
;
//# sourceMappingURL=ProxyScrapeDotCom.js.map