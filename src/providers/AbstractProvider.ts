import HttpProxy from "../HttpProxy";

export default abstract class AbstractProvider {
    static url: string;

    abstract fetchList(): Promise<Array<HttpProxy>>
}
