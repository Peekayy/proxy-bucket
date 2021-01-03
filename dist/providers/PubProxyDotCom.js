"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
// TODO
async function getProxy() {
    const response = await axios_1.default.get("http://pubproxy.com/api/proxy?format=json&type=http&https=false");
    return response.data.data[0];
}
//# sourceMappingURL=PubProxyDotCom.js.map