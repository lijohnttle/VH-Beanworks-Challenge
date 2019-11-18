import DataSyncSessionModel from "../../models/DataSyncSessionModel";

class DataSyncSessionsMongoDBStorage {
    constructor(connectToDb) {
        this.connectToDb = connectToDb;
    }

    /**
     * @param {DataSyncSessionModel[]} items
     * @returns {Promise}
     */
    persist(items) {
        return new Promise(async (resolve, reject) => {
            const db = await this.connectToDb;

            db.collection('syncSessions', (error, collection) => {
                if (error) {
                    reject(error);
                    return;
                }

                var bulkUpdateOps = items.map(doc => {
                    return {
                        "updateOne": {
                            "filter": { "_id": doc.sessionID },
                            "update": {
                                "$set": {
                                    "_id": doc.sessionID,
                                    "status": doc.status,
                                    "startedUTC": doc.startedUTC,
                                    "syncLog": doc.syncLog
                                }
                            },
                            "upsert": true
                        }
                    };
                });

                collection.bulkWrite(bulkUpdateOps, (error, _) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                });
            });
        });
    }

    async getItems() {
        return new Promise(async (resolve, reject) => {
            const db = await this.connectToDb;

            db.collection('syncSessions', (error, collection) => {
                if (error) {
                    reject(error);
                    return;
                }

                return collection.find().toArray((error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(result.map(s => new DataSyncSessionModel(s._id, s.status, s.startedUTC, s.syncLog)));
                });
            });
        });
    }
}

export default DataSyncSessionsMongoDBStorage;