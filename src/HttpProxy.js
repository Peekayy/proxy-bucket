module.exports = class HttpProxy {

    constructor(ip, port, rating = 0) {
        this.ip = ip;
        this.port = port;
        this.rating = rating;
    }

    get addr() {
        return `${this.ip}:${this.port}`;
    }

    get url() {
        return `http://${this.addr}:${this.port}`;
    }

    toString() {
        return `${this.rating} ${this.url}`;
    }

    static compare(proxyA, proxyB) {
        return Math.sign(proxyA.rating - proxyB.rating);
    }
};
