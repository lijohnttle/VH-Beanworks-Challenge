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

                items.forEach(doc => {
                    (function update() {
                        collection.updateOne(
                            { "_id": doc.sessionID },
                            {"$set": {
                                "_id": doc.sessionID,
                                "status": doc.status,
                                "startedUTC": doc.startedUTC,
                                "syncLog": doc.syncLog
                                }
                            },
                            {upsert: true, safe: false},
                            (err) => {
                                if (err) {
                                    if (err.code == 11000) {
                                        update();
                                        return;
                                    }

                                    console.log(err);
                                }
                            });
                    })();
                });
                
                resolve();
            });
        });
    }

    /**
     * @param {DataSyncSessionModel[]} items
     * @returns {Promise}
     */
    persistSyncLog(items) {
        return new Promise(async (resolve, reject) => {
            const db = await this.connectToDb;

            db.collection('syncSessions', (error, collection) => {
                if (error) {
                    reject(error);
                    return;
                }

                items.forEach(doc => {
                    collection.updateOne(
                        { "_id": doc.sessionID },
                        { "$set": { "syncLog": doc.syncLog } },
                        { upsert: false, safe: false },
                        (err) => {
                            if (err) {
                                console.log(err);
                            }
                        }
                    );
                });

                resolve();
            });
        });
    }

        /**
     * @param {DataSyncSessionModel[]} items
     * @returns {Promise}
     */
    persistStatus(items) {
        return new Promise(async (resolve, reject) => {
            const db = await this.connectToDb;

            db.collection('syncSessions', (error, collection) => {
                if (error) {
                    reject(error);
                    return;
                }

                items.forEach(doc => {
                    collection.updateOne(
                        { "_id": doc.sessionID },
                        { "$set": { "status": doc.status } },
                        { upsert: false, safe: false },
                        (err) => {
                            if (err) {
                                console.log(err);
                            }
                        }
                    );
                });

                resolve();
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