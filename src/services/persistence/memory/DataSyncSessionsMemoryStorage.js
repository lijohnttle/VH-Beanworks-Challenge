import DataSyncSessionModel from "../../../models/DataSyncSessionModel";

class DataSyncSessionsMemoryStorage {
    constructor() {
        this.items = [];
        this.sessionCounter = 1;
    }

    /**
     * @param {DataSyncSessionModel[]} items
     * @returns {Promise}
     */
    async persist(items) {
        items.forEach(session => {
            if (!session.sessionID) {
                session.sessionID = this.sessionCounter;
                
                this.sessionCounter++;
            }

            const existing = this.items.find(s => s.sessionID === session.sessionID);

            if (!existing) {
                this.items.push(session);
            }
        });
    }

    async getItems() {
        return Promise.resolve(this.items);
    }
}

export default DataSyncSessionsMemoryStorage;