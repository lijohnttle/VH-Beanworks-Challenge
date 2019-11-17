import SyncDataSessionsMemoryStorage from './SyncDataSessionsMemoryStorage';
import AccountMemoryStorage from './AccountMemoryStorage';
import VendorMemoryStorage from './VendorMemoryStorage';

export default {
    syncDataSessionsStorage: new SyncDataSessionsMemoryStorage(),
    accountStorage: new AccountMemoryStorage(),
    vendorStorage: new VendorMemoryStorage()
};