import VendorModel from "../../../models/VendorModel";

class VendorRepository {
    constructor(connectToDb) {
        this.connectToDb = connectToDb;
    }

    /**
     * @param {VendorModel[]} vendors
     * @returns {Promise}
     */
    persist(items) {
        return new Promise(async (resolve, reject) => {
            const db = await this.connectToDb;

            db.collection('vendors', (error, collection) => {
                if (error) {
                    reject(error);
                    return;
                }

                var bulkUpdateOps = items.map(doc => {
                    return {
                        "updateOne": {
                            "filter": { "_id": doc.vendorID },
                            "update": {
                                "$set": {
                                    "_id": doc.vendorID,
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

    async getItems() {
        return new Promise(async (resolve, reject) => {
            const db = await this.connectToDb;

            db.collection('vendors', (error, collection) => {
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

export default VendorRepository;