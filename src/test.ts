import * as DebugFactory from "debug";
import ProxyListDotDownload from "./providers/ProxyListDotDownload";

const debug = DebugFactory("pb.test.js");

(async () => {
    // const bucket = new ProxyBucket();
    //
    // const proxy = await bucket.getOne();
    // debug(proxy);
    // await bucket.goodReview(proxy);

    const provider = new ProxyListDotDownload();

    debug(await provider.fetchList());
})();
