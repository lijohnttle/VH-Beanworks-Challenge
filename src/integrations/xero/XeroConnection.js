import { AccountingAPIClient } from "xero-node";

class XeroConnection {
    constructor(xeroConfig) {
        this.client = new AccountingAPIClient(xeroConfig);
    }
}

export default XeroConnection;