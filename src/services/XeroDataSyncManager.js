import ServerContext from '../server/ServerContext';
import XeroConnectionContext from "./XeroConnectionContext";
import EventTypes from '../events/EventType';
import SyncDataOperation from '../constants/SyncDataOperation';
import SyncDataState from '../constants/SyncDataState';
import SyncDataItem from '../constants/SyncDataItem';
import SyncLogRecordModel from '../models/SyncLogRecordModel';
import SyncCompleteStatus from '../models/SyncCompleteStatus';
import SyncDataSessionModel from '../models/SyncDataSessionModel';


/**
 * Synchronizes accounts information from Xero.
 * 
 * @param {SyncDataSessionModel} session
 * @param {ServerContext} serverContext
 * @param {XeroConnectionContext} xeroContext
 * 
 * @returns {Promise}
 */
async function syncAccounts(session, serverContext, xeroContext) {
    const { eventEmitter, storages } = serverContext;
    const { loaders, connection } = xeroContext;

    session.addLogRecord(new SyncLogRecordModel(
        Date.now(),
        SyncDataOperation.SYNC_FROM_ERP,
        SyncDataState.START,
        SyncDataItem.ACCOUNT
    ));

    eventEmitter.emit(EventTypes.SYNC_DATA_UPDATE, session);

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
        session.addLogRecord(new SyncLogRecordModel(
            Date.now(),
            SyncDataOperation.SYNC_FROM_ERP,
            SyncDataState.START,
            SyncDataItem.ACCOUNT,
            completeStatus
        ));

        eventEmitter.emit(EventTypes.SYNC_DATA_UPDATE, session);
    }
}

/**
 * Synchronizes vendors information from Xero.
 * 
 * @param {SyncDataSessionModel} session
 * @param {ServerContext} serverContext
 * @param {XeroConnectionContext} xeroContext
 * 
 * @returns {Promise}
 */
async function syncVendors(session, serverContext, xeroContext) {
    const { eventEmitter, storages } = serverContext;
    const { loaders, connection } = xeroContext;

    session.addLogRecord(new SyncLogRecordModel(
        Date.now(),
        SyncDataOperation.SYNC_FROM_ERP,
        SyncDataState.START,
        SyncDataItem.VENDOR
    ));

    eventEmitter.emit(EventTypes.SYNC_DATA_UPDATE, session);

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
        session.addLogRecord(new SyncLogRecordModel(
            Date.now(),
            SyncDataOperation.SYNC_FROM_ERP,
            SyncDataState.START,
            SyncDataItem.VENDOR,
            completeStatus
        ));

        eventEmitter.emit(EventTypes.SYNC_DATA_UPDATE, session);
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
        this.activeSession = null;
    }

    /**
     * Synchronizes data with Zero.
     * 
     * @returns {Promise}
     */
    async syncData() {
        if (this.activeSession) {
            return;
        }

        try {
            this.serverContext.eventEmitter.emit(EventTypes.SYNC_DATA_STARTED);
            this.activeSession = new SyncDataSessionModel(null, 'ACTIVE', Date.now());
            this.serverContext.eventEmitter.emit(EventTypes.SYNC_DATA_UPDATE, this.activeSession);
            
            await Promise.all([
                syncAccounts(this.activeSession, this.serverContext, this.xeroContext),
                syncVendors(this.activeSession, this.serverContext, this.xeroContext)
            ]);

            await new Promise(resolve => {
                setTimeout(resolve, 3000);
            });
        }
        catch (error) {
            console.error(error);
        }
        finally {
            const completedSession = this.activeSession;

            this.activeSession.status = 'COMPLETE';
            this.serverContext.eventEmitter.emit(EventTypes.SYNC_DATA_UPDATE, this.activeSession);
            this.activeSession = null;
            this.serverContext.eventEmitter.emit(EventTypes.SYNC_DATA_COMPLETE, completedSession);
        }
    }
}