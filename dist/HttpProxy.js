"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpProxy {
    constructor(ip, port, provider, rating = 0) {
        this.ip = ip;
        this.port = port;
        this.rating = rating;
        this.provider = provider;
    }
    get addr() {
        return `${this.ip}:${this.port}`;
    }
    get url() {
        return `http://${this.addr}`;
    }
    toString() {
        return `${this.rating} ${this.url}`;
    }
    static compare(proxyA, proxyB) {
        return Math.sign(proxyB.rating - proxyA.rating);
    }
}
exports.default = HttpProxy;
//# sourceMappingURL=HttpProxy.js.map