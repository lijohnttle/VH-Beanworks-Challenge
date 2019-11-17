import XeroConnection from "../integrations/xero/XeroConnection";

export default class XeroConnectionContext {
    /**
     * @param {Object} xeroLoaders 
     * @param {XeroConnection} xeroConnection 
     */
    constructor(xeroLoaders, xeroConnection) {
        this.loaders = xeroLoaders;
        this.connection = xeroConnection;
    }
}