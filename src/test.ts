import ProxyBucket from "./ProxyBucket";
import * as DebugFactory from "debug";

const debug = DebugFactory("pb.test.js");

(async () => {
    const bucket = new ProxyBucket();

    const proxy = await bucket.getOne();
    debug(proxy);
    await bucket.goodReview(proxy);
})();
