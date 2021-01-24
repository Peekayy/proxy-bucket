import {HttpProxy} from "../HttpProxy";
import * as DebugFactory from "debug";
import AbstractProvider from "./AbstractProvider";
import axios from "axios";
import {ProxyProtocol} from "../types";

const debug = DebugFactory("pb.providers.PubProxyDotCom");

export default class PubProxyDotCom extends AbstractProvider {

    static url = "http://pubproxy.com/api/proxy?format=json&type=http&https=true&limit=5&user_agent=true&cookies=true&level=elite";

    async fetchList(): Promise<Array<HttpProxy>> {
        try {
            const response = await axios.get(PubProxyDotCom.url);
            return response.data.data.filter(p => p)
                .map(p => {
                    const protocol = `${p.type}${p.support.https === 1 ? "s" : ""}` as ProxyProtocol;
                    return new HttpProxy(p.ip,
                        parseInt(p.port, 10),
                        PubProxyDotCom.name,
                        0,
                        parseInt(p.speed, 10) * 2000,
                        protocol);
                });
        } catch (err) {
            debug(`Failed to get proxies list : ${err.message}`);
            return [];
        }

    }
};
