const ProxyBucket = require("./src/ProxyBucket");
const debug = require("debug")("test.js");
const request = require("request-promise-native");

(async () => {
    const bucket = new ProxyBucket();

    
    const proxy = await bucket.getOne();
    debug(proxy);

})();
