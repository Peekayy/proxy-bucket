"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpProxy_1 = require("../HttpProxy");
const DebugFactory = require("debug");
const AbstractProvider_1 = require("./AbstractProvider");
const axios_1 = require("axios");
const debug = DebugFactory("pb.providers.ProxyListDotDownload");
class ProxyListDotDownload extends AbstractProvider_1.default {
    async fetchList() {
        const list = [];
        list.push(...await this.getFromUrl("http"));
        list.push(...await this.getFromUrl("https"));
        return list;
    }
    async getFromUrl(protocol) {
        let rawList;
        try {
            debug(`Get from ${ProxyListDotDownload.url(protocol)}`);
            let response = await axios_1.default.get(ProxyListDotDownload.url(protocol), {
                responseType: "text"
            });
            rawList = response.data;
            debug(rawList);
            return rawList.split("\r\n")
                .filter(p => p)
                .map(p => p.split(":"))
                .map(p => new HttpProxy_1.default(p[0], p[1], ProxyListDotDownload.name, 0, undefined, protocol));
        }
        catch (err) {
            debug(`Failed to get proxies list : ${err.message}`);
            return [];
        }
    }
}
exports.default = ProxyListDotDownload;
ProxyListDotDownload.url = (protocol) => `https://www.proxy-list.download/api/v1/get?type=${protocol}`;
;
//# sourceMappingURL=ProxyListDotDownload.js.map