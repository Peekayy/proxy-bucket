import {HttpProxy} from "../HttpProxy";
import * as DebugFactory from "debug";
import AbstractProvider from "./AbstractProvider";
import axios from "axios";
import * as cheerio from "cheerio";

const debug = DebugFactory("pb.providers.FreeProxyListsDotNet");

export default class FreeProxyListsDotNet extends AbstractProvider {

    static url = "http://www.freeproxylists.net/fr/?pr=HTTP&u=50&s=u";

    async fetchList(): Promise<Array<HttpProxy>> {
        let rawList;
        try {
            const response = await axios.get(FreeProxyListsDotNet.url, {
                responseType: "arraybuffer",
            });

            const $ = cheerio.load(response.data);
            const rows = $(".DataGrid tbody tr.Odd, .DataGrid tbody tr.Even").toArray();

            for (const row of rows) {
                const tds = $(row).children("td").slice(0, 2);
                console.log(tds);
            }

            return "".split("\r\n")
                .filter(p => p)
                .map(p => p.split(":"))
                .map(p => new HttpProxy(p[0], parseInt(p[1], 10), FreeProxyListsDotNet.name));
        } catch (err) {
            debug(`Failed to get proxies list : ${err.message}`);
            return [];
        }

    }
};
