const request = require("request-promise-native");
const debug = require("debug")("pb.providers.ProxyListDotDownload");
const HttpProxy = require("../HttpProxy");

module.exports = class ProxyListDotDownload {

    static url = "https://www.proxy-list.download/api/v1/get?type=http";

    async fetchList() {
        let rawList;
        try {
            rawList = await request(ProxyListDotDownload.url);
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
