const ProxyBucket = require("./src/ProxyBucket");
const debug = require("debug")("test.js");

(async () => {
    const bucket = new ProxyBucket();

    const proxy = await bucket.getOne();
    debug(proxy);

    await bucket.goodReview(proxy);
})();
