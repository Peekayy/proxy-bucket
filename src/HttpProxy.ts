import {ProxyProtocol} from "./types";

export class HttpProxy {
    public ip: string;
    public port: number;
    public rating: number;
    public provider: string;
    public timeout: number;
    public protocol: ProxyProtocol;
    public lock?: number;


    constructor(ip: string, port: number, provider: string, rating: number = 0, timeout: number = 5000, protocol: ProxyProtocol = "http") {
        this.ip = ip;
        this.port = port;
        this.rating = rating;
        this.provider = provider;
        this.timeout = timeout;
        this.protocol = protocol;
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
