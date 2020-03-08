const request = require("request-promise-native");
const debug = require("debug")("pb.providers.ProxyScrapeDotCom");
const HttpProxy = require("../HttpProxy");

module.exports = class ProxyScrapeDotCom {

    static url = "https://api.proxyscrape.com/?request=getproxies&proxytype=http&timeout=10000&country=all&ssl=no&anonymity=elite&format=normal";

    async fetchList() {
        let rawList;
        try {
            rawList = await request(ProxyScrapeDotCom.url);
            debug(rawList);
            return rawList.split("\r\n")
                .filter(p => p)
                .map(p => p.split(":"))
                .map(p => new HttpProxy(p[0], p[1]));
        } catch (err) {
            debug(`Failed to get proxies list : ${err.message}`);
            return [];
        }

    }
};
