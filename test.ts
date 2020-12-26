import ProxyBucket from "./src/ProxyBucket";
import * as DebugFactory from "debug";

const debug = DebugFactory("test.js");

(async () => {
    const bucket = new ProxyBucket();

    const proxy = await bucket.getOne();
    debug(proxy);

    await bucket.goodReview(proxy);
})();
