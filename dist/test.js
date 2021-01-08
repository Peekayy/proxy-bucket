"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DebugFactory = require("debug");
const ProxyListDotDownload_1 = require("./providers/ProxyListDotDownload");
const debug = DebugFactory("pb.test.js");
(async () => {
    // const bucket = new ProxyBucket();
    //
    // const proxy = await bucket.getOne();
    // debug(proxy);
    // await bucket.goodReview(proxy);
    const provider = new ProxyListDotDownload_1.default();
    debug(await provider.fetchList());
})();
//# sourceMappingURL=test.js.map