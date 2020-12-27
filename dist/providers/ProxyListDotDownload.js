"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise-native");
const HttpProxy_1 = require("../HttpProxy");
const DebugFactory = require("debug");
const AbstractProvider_1 = require("./AbstractProvider");
const debug = DebugFactory("pb.providers.ProxyListDotDownload");
class ProxyListDotDownload extends AbstractProvider_1.default {
    async fetchList() {
        let rawList;
        try {
            rawList = await request(ProxyListDotDownload.url);
            debug(rawList);
            return rawList.split("\r\n")
                .filter(p => p)
                .map(p => p.split(":"))
                .map(p => new HttpProxy_1.default(p[0], p[1], ProxyListDotDownload.name));
        }
        catch (err) {
            debug(`Failed to get proxies list : ${err.message}`);
            return [];
        }
    }
}
exports.default = ProxyListDotDownload;
ProxyListDotDownload.url = "https://www.proxy-list.download/api/v1/get?type=http";
;
//# sourceMappingURL=ProxyListDotDownload.js.map