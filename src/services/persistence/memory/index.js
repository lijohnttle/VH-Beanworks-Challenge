import DataSyncSessionRepository from './DataSyncSessionRepository';
import AccountRepository from './AccountRepository';
import VendorRepository from './VendorRepository';

export function useRepositories() {
    return {
        dataSyncSessions: new DataSyncSessionRepository(),
        accounts: new AccountRepository(),
        vendors: new VendorRepository()
    };
};