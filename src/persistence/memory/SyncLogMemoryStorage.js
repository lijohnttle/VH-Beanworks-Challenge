import SyncLogRecordModel from "../../models/SyncLogRecordModel";

class SyncLogMemoryStorage {
    constructor() {
        this.items = [];
    }

    /**
     * @param {SyncLogRecordModel[]} items
     * @returns {Promise}
     */
    async persist(items) {
        this.items = items;
    }
}

export default SyncLogMemoryStorage;