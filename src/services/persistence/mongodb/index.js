import { MongoClient } from 'mongodb';
import DataSyncSessionRepository from './DataSyncSessionRepository';
import AccountRepository from './AccountRepository';
import VendorRepository from './VendorRepository';

export function useRepositories(config) {
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
        dataSyncSessions: new DataSyncSessionRepository(connect),
        accounts: new AccountRepository(connect),
        vendors: new VendorRepository(connect)
    };
}