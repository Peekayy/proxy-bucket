import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import ProxyBucket from "./ProxyBucket";
import HttpProxy from "./HttpProxy";
import * as DebugFactory from "debug";
import {IFrontendOptions} from "./types";
import {sleep} from "./tools";

const debug = DebugFactory("pb.ProxyFrontend");

export default class ProxyFrontend {

    private currentProxy: HttpProxy;
    private lastReqMs: number = 0;

    constructor(private readonly options: IFrontendOptions = {},
                private readonly bucket?: ProxyBucket) {
        if (!bucket) {
            this.bucket = new ProxyBucket();
        }

        this.options = Object.assign({}, {
            timeout: 60000,
            perProxyAttempts: 10,
            minReqDelay: 1000,
            proxyTimeoutOverride: 0
        } as IFrontendOptions, options || {});

    }

    async request(config: AxiosRequestConfig): Promise<AxiosResponse> {
        let nok = true;
        let retry = true;
        let response;
        let axiosConfig: AxiosRequestConfig;
        let attempts;
        let now;
        let fallbackTimeout;

        while (nok) {
            if (!this.currentProxy) {
                this.currentProxy = await this.bucket.getOne();
                attempts = 0;

                axiosConfig = Object.assign({}, config, {
                    proxy: {
                        host: this.currentProxy.ip,
                        port: this.currentProxy.port
                    },
                    timeout: this.options.proxyTimeoutOverride || this.currentProxy.timeout
                } as AxiosRequestConfig);
                debug(`Using proxy : ${this.currentProxy.ip}:${this.currentProxy.port}[${this.currentProxy.provider}] (${this.currentProxy.rating}★)`);
            }
            try {
                attempts++;
                now = Date.now();
                if (this.lastReqMs + this.options.minReqDelay > now) {
                    const duration = this.lastReqMs + this.options.minReqDelay - now;
                    debug(`Too early, pausing for ${duration}`);
                    await sleep(duration);
                }
                this.lastReqMs = Date.now();

                // Ensure a timeout in case the proxy messes with the socket.
                if (axiosConfig.timeout) {
                    const source = axios.CancelToken.source();
                    axiosConfig.cancelToken = source.token;
                    fallbackTimeout = setTimeout(() => {
                        debug("Used fallback timeout");
                        source.cancel(`timeout of ${axiosConfig.timeout}ms exceeded`)
                    }, axiosConfig.timeout + 100)
                }

                response = await axios.request(axiosConfig);
                await this.bucket.goodReview(this.currentProxy);
            } catch (err) {
                debug(`Error : ${err.message}`);
                if (attempts >= this.options.perProxyAttempts) {
                    await this.bucket.badReview(this.currentProxy);
                    this.currentProxy = null;
                } else if (err.response && this.options.isProxyError) {
                    const isProxyError = this.options.isProxyError(err.response);
                    if (!isProxyError) {
                        // error but not proxy's fault
                        response = err.response;
                        await this.bucket.goodReview(this.currentProxy);
                    }
                } else if (err.response) {
                    // erroneous response, but response anyway probably not proxy's fault
                    response = err.response;
                    await this.bucket.goodReview(this.currentProxy);
                }
            } finally {
                clearTimeout(fallbackTimeout);
            }
            nok = !response && retry;
        }

        return response;

    }
}

