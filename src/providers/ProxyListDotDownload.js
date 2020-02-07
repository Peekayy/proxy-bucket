const request = require("request-promise-native");
const debug = require("debug")("pb.providers.ProxyListDotDownload");
const HttpProxy = require("../HttpProxy");
const VError = require("verror");

module.exports = class ProxyListDotDownload {

    static url = "https://www.proxy-list.download/api/v1/get?type=http";

    async fetchList() {
        let rawList;
        try {
            rawList = await request(ProxyListDotDownload.url);
        } catch (err) {
            throw new VError(err, "Failed to get proxies list");
        }
        debug(rawList);
        return rawList.split("\r\n")
            .filter(p => p)
            .map(p => p.split(":"))
            .map(p => new HttpProxy(p[0], p[1]));
    }
};
