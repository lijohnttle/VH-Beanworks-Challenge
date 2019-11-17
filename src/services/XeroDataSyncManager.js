import ServerContext from '../server/ServerContext';
import XeroConnectionContext from "./XeroConnectionContext";
import EventTypes from '../events/EventType';
import SyncDataOperation from '../constants/SyncDataOperation';
import SyncDataState from '../constants/SyncDataState';
import SyncDataItem from '../constants/SyncDataItem';
import SyncLogRecordModel from '../models/SyncLogRecordModel';
import SyncCompleteStatus from '../models/SyncCompleteStatus';


/**
 * Synchronizes accounts information from Xero.
 * 
 * @param {ServerContext} serverContext
 * @param {XeroConnectionContext} xeroContext
 * 
 * @returns {Promise}
 */
async function syncAccounts(serverContext, xeroContext) {
    const { eventEmitter, storages } = serverContext;
    const { loaders, connection } = xeroContext;


    eventEmitter.emit(EventTypes.LOG_SYNC_DATA, new SyncLogRecordModel(
        Date.now(),
        SyncDataOperation.SYNC_FROM_ERP,
        SyncDataState.START,
        SyncDataItem.ACCOUNT
    ));

    let completeStatus = null;

    try {
        const accounts = await loaders.accountLoader.load(connection);

        await storages.accountStorage.persist(accounts);
    }
    catch (error) {
        completeStatus = new SyncCompleteStatus(error);

        throw error;
    }
    finally {
        eventEmitter.emit(EventTypes.LOG_SYNC_DATA, new SyncLogRecordModel(
            Date.now(),
            SyncDataOperation.SYNC_FROM_ERP,
            SyncDataState.START,
            SyncDataItem.ACCOUNT,
            completeStatus
        ));
    }
}

/**
 * Synchronizes vendors information from Xero.
 * 
 * @param {ServerContext} serverContext
 * @param {XeroConnectionContext} xeroContext
 * 
 * @returns {Promise}
 */
async function syncVendors(serverContext, xeroContext) {
    const { eventEmitter, storages } = serverContext;
    const { loaders, connection } = xeroContext;

    eventEmitter.emit(EventTypes.LOG_SYNC_DATA, new SyncLogRecordModel(
        Date.now(),
        SyncDataOperation.SYNC_FROM_ERP,
        SyncDataState.START,
        SyncDataItem.VENDOR
    ));

    let completeStatus = null;

    try {
        const vendors = await loaders.vendorLoader.load(connection);

        await storages.vendorStorage.persist(vendors);
    }
    catch (error) {
        completeStatus = new SyncCompleteStatus(error);

        throw error;
    }
    finally {
        eventEmitter.emit(EventTypes.LOG_SYNC_DATA, new SyncLogRecordModel(
            Date.now(),
            SyncDataOperation.SYNC_FROM_ERP,
            SyncDataState.START,
            SyncDataItem.VENDOR,
            completeStatus
        ));
    }
}

export default class XeroDataSyncManager {
    /**
     * @param {ServerContext} serverContext
     * @param {XeroConnectionContext} xeroContext
     */
    constructor(serverContext, xeroContext) {
        this.serverContext = serverContext;
        this.xeroContext = xeroContext;
    }

    /**
     * Synchronizes data with Zero.
     * 
     * @returns {Promise}
     */
    async syncData() {
        this.serverContext.eventEmitter.emit(EventTypes.SYNC_DATA_STARTED);

        try {
            await Promise.all([
                syncAccounts(this.serverContext, this.xeroContext),
                syncVendors(this.serverContext, this.xeroContext)
            ]);

            await new Promise(resolve => {
                setTimeout(resolve, 3000);
            });
        }
        catch (error) {
            console.error(error);
        }
        finally {
            this.serverContext.eventEmitter.emit(EventTypes.SYNC_DATA_COMPLETE);
        }
    }
}