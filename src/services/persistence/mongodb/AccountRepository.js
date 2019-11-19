import AccountModel from "../../../models/AccountModel";

class AccountRepository {
    constructor(connectToDb) {
        this.connectToDb = connectToDb;
    }

    /**
     * @param {AccountModel[]} items
     * @returns {Promise}
     */
    persist(items) {
        return new Promise(async (resolve, reject) => {
            const db = await this.connectToDb;

            db.collection('accounts', (error, collection) => {
                if (error) {
                    reject(error);
                    return;
                }

                var bulkUpdateOps = items.map(doc => {
                    return {
                        "updateOne": {
                            "filter": { "_id": doc.accountID },
                            "update": {
                                "$set": {
                                    "_id": doc.accountID,
                                    "name": doc.name,
                                    "status": doc.status,
                                    "updatedDateUTC": doc.updatedDateUTC
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

    getItems() {
        return new Promise(async (resolve, reject) => {
            const db = await this.connectToDb;

            db.collection('accounts', (error, collection) => {
                if (error) {
                    reject(error);
                    return;
                }

                return collection.find().toArray((error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(result);
                });
            });
        });
    }
}

export default AccountRepository;