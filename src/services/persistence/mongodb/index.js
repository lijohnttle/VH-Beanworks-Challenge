import { MongoClient } from 'mongodb';
import DataSyncSessionsMongoDBStorage from './DataSyncSessionsMongoDBStorage.js';
import AccountMongoDBStorage from './AccountMongoDBStorage';
import VendorMongoDBStorage from './VendorMongoDBStorage';

export function useStorages(config) {
    const connect = new Promise((resolve, reject) => {
        MongoClient.connect(config.server.connectionString, (error, db) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(db.db());
            }
        });
    });
    
    return {
        dataSyncSessionsStorage: new DataSyncSessionsMongoDBStorage(connect),
        accountStorage: new AccountMongoDBStorage(connect),
        vendorStorage: new VendorMongoDBStorage(connect)
    };
}