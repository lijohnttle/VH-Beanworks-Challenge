import DataSyncSessionsMemoryStorage from './DataSyncSessionsMemoryStorage';
import AccountMemoryStorage from './AccountMemoryStorage';
import VendorMemoryStorage from './VendorMemoryStorage';

export function useStorages() {
    return {
        dataSyncSessionsStorage: new DataSyncSessionsMemoryStorage(),
        accountStorage: new AccountMemoryStorage(),
        vendorStorage: new VendorMemoryStorage()
    };
};