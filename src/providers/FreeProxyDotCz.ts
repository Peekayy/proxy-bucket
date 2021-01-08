import HttpProxy from "../HttpProxy";
import * as DebugFactory from "debug";
import AbstractProvider from "./AbstractProvider";
import axios from "axios";
import * as cheerio from "cheerio";

const debug = DebugFactory("pb.providers.FreeProxyDotCz");

export default class FreeProxyDotCz extends AbstractProvider {

    static url1 = "http://free-proxy.cz/fr/proxylist/country/all/http/uptime/level1";
    static url2 = "http://free-proxy.cz/fr/proxylist/country/all/http/uptime/level2";

    async fetchList(): Promise<Array<HttpProxy>> {
        let rawList;
        try {
            const response = await axios.get(FreeProxyDotCz.url1, {
                responseType: "arraybuffer",
            });

            const $ = cheerio.load(response.data);
            const rows = $("#proxy_list tbody tr").toArray();

            for (const row of rows) {
                debug($(row).children("td").eq(0).text());
            }

            return "".split("\r\n")
                .filter(p => p)
                .map(p => p.split(":"))
                .map(p => new HttpProxy(p[0], parseInt(p[1], 10), FreeProxyDotCz.name));
        } catch (err) {
            debug(`Failed to get proxies list : ${err.message}`);
            return [];
        }

    }
};
