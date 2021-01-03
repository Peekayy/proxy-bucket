import {AxiosResponse} from "axios";

interface IFrontendOptions {
    timeout?: number,
    perProxyAttempts?: number,
    /**
     * Callback upon request error in order to decide if it's a proxy error or a legitimate remote site error.
     *
     * For instance, testing for a particular expected header for the the remote site that proxies would never set.
     * @param response
     */
    isProxyError?: (response: AxiosResponse) => boolean,
    /**
     * Minimal time between 2 requests in ms. Prevents flooding the proxies.
     */
    minReqDelay?: number,
    proxyTimeoutOverride?: number
}
