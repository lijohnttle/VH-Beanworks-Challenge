import { AccountingAPIClient } from "xero-node";

export default class XeroConnection {
    constructor(xeroConfig) {
        this.client = new AccountingAPIClient(xeroConfig);
    }
}