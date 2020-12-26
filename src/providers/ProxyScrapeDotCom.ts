import * as request from "request-promise-native";
import HttpProxy from "../HttpProxy";
import * as DebugFactory from "debug";
import AbstractProvider from "./AbstractProvider";

const debug = DebugFactory("pb.providers.ProxyScrapeDotCom");

export default class ProxyScrapeDotCom extends AbstractProvider {

    static url = "https://api.proxyscrape.com/?request=getproxies&proxytype=http&timeout=10000&country=all&ssl=no&anonymity=elite&format=normal";

    async fetchList(): Promise<Array<HttpProxy>> {
        let rawList;
        try {
            rawList = await request(ProxyScrapeDotCom.url);
            debug(rawList);
            return rawList.split("\r\n")
                .filter(p => p)
                .map(p => p.split(":"))
                .map(p => new HttpProxy(p[0], p[1], ProxyScrapeDotCom.name));
        } catch (err) {
            debug(`Failed to get proxies list : ${err.message}`);
            return [];
        }

    }
};
