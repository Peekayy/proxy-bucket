"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProxyBucket_1 = require("./ProxyBucket");
const DebugFactory = require("debug");
const debug = DebugFactory("pb.test.js");
(async () => {
    const bucket = new ProxyBucket_1.default();
    const proxy = await bucket.getOne();
    debug(proxy);
    await bucket.goodReview(proxy);
})();
//# sourceMappingURL=test.js.map