import { XeroAccountLoader, XeroVendorLoader } from "./loaders";
import XeroConnection from "./XeroConnection";
import AccountStorage from '../../persistence/memory/AccountMemoryStorage';

class XeroSyncManager {
    /**
     * @param {XeroConnection} connection
     */
    constructor(connection) {
        this.connection = connection;
    }

    /**
     * @param {XeroAccountLoader} loader
     * @param {AccountStorage} storage
     * @returns {Promise}
     */
    async sync(loader, storage) {
        const models = await loader.load(this.connection);

        await storage.persist(models);
    }
}

export default XeroSyncManager;