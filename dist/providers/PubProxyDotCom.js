"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpProxy_1 = require("../HttpProxy");
const DebugFactory = require("debug");
const AbstractProvider_1 = require("./AbstractProvider");
const axios_1 = require("axios");
const debug = DebugFactory("pb.providers.PubProxyDotCom");
class PubProxyDotCom extends AbstractProvider_1.default {
    async fetchList() {
        try {
            const response = await axios_1.default.get(PubProxyDotCom.url);
            return response.data.data.filter(p => p)
                .map(p => {
                const protocol = `${p.type}${p.support.https === 1 ? "s" : ""}`;
                return new HttpProxy_1.default(p.ip, parseInt(p.port, 10), PubProxyDotCom.name, 0, parseInt(p.speed, 10) * 2000, protocol);
            });
        }
        catch (err) {
            debug(`Failed to get proxies list : ${err.message}`);
            return [];
        }
    }
}
exports.default = PubProxyDotCom;
PubProxyDotCom.url = "http://pubproxy.com/api/proxy?format=json&type=http&https=true&limit=5&user_agent=true&cookies=true&level=elite";
;
//# sourceMappingURL=PubProxyDotCom.js.map