import {HttpProxy} from "../HttpProxy";
import * as DebugFactory from "debug";
import AbstractProvider from "./AbstractProvider";
import axios from "axios";
import {ProxyProtocol} from "../types";

const debug = DebugFactory("pb.providers.ProxyListDotDownload");

export default class ProxyListDotDownload extends AbstractProvider {

    static url = (protocol) => `https://www.proxy-list.download/api/v1/get?type=${protocol}`;

    async fetchList(): Promise<Array<HttpProxy>> {
        const list = [];
        list.push(...await this.getFromUrl("http"));
        list.push(...await this.getFromUrl("https"));
        return list;
    }

    private async getFromUrl(protocol: ProxyProtocol): Promise<HttpProxy[]> {
        let rawList;
        try {
            debug(`Get from ${ProxyListDotDownload.url(protocol)}`);
            let response = await axios.get(ProxyListDotDownload.url(protocol), {
                responseType: "text"
            });
            rawList = response.data;
            debug(rawList);
            return rawList.split("\r\n")
                .filter(p => p)
                .map(p => p.split(":"))
                .map(p => new HttpProxy(p[0], p[1], ProxyListDotDownload.name, 0, undefined, protocol));
        } catch (err) {
            debug(`Failed to get proxies list : ${err.message}`);
            return [];
        }
    }
};
