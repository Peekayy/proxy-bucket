export default class HttpProxy {
    public ip: string;
    public port: number;
    public rating: number;
    public provider: string;


    constructor(ip: string, port: number, provider: string, rating: number = 0) {
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
