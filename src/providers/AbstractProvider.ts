import HttpProxy from "../HttpProxy";

export default abstract class AbstractProvider {

    abstract fetchList(): Promise<Array<HttpProxy>>
}
