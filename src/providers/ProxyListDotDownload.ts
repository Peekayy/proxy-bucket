import HttpProxy from "../HttpProxy";
import * as DebugFactory from "debug";
import AbstractProvider from "./AbstractProvider";
import axios from "axios";

const debug = DebugFactory("pb.providers.ProxyListDotDownload");

export default class ProxyListDotDownload extends AbstractProvider {

    static url = "https://www.proxy-list.download/api/v1/get?type=http";

    async fetchList(): Promise<Array<HttpProxy>> {
        let rawList;
        try {
            const response = await axios.get(ProxyListDotDownload.url, {
                responseType: "text"
            });
            rawList = response.data;
            debug(rawList);
            return rawList.split("\r\n")
                .filter(p => p)
                .map(p => p.split(":"))
                .map(p => new HttpProxy(p[0], p[1], ProxyListDotDownload.name));
        } catch (err) {
            debug(`Failed to get proxies list : ${err.message}`);
            return [];
        }
    }
};
