import SyncLogMemoryStorage from './SyncLogMemoryStorage';
import AccountMemoryStorage from './AccountMemoryStorage';
import VendorMemoryStorage from './VendorMemoryStorage';

export default {
    syncLogStorage: new SyncLogMemoryStorage(),
    accountStorage: new AccountMemoryStorage(),
    vendorStorage: new VendorMemoryStorage()
};