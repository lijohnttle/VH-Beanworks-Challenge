import { EventEmitter } from "events";
import XeroConnection from "../integrations/xero/XeroConnection";
import EventTypes from '../events/EventType';
import SyncDataOperation from '../constants/SyncDataOperation';
import SyncDataState from '../constants/SyncDataState';
import SyncDataItem from '../constants/SyncDataItem';
import SyncLogRecordModel from '../models/SyncLogRecordModel';
import SyncCompleteStatus from '../models/SyncCompleteStatus';

class XeroDataSyncManager {
    /**
     * @param {Object} loaders 
     * @param {Object} storages 
     * @param {EventEmitter} eventEmitter 
     * @param {XeroConnection} connection 
     */
    constructor(loaders, storages, eventEmitter, connection) {
        this.loaders = loaders;
        this.storages = storages;
        this.eventEmitter = eventEmitter;
        this.connection = connection;
    }

    /**
     * @returns {Promise}
     */
    async syncAll() {
        await Promise.all([
            this.syncAccounts(),
            this.syncVendors(),
        ]);

        console.log(this.storages.accountStorage.items.length);
    }

    /**
     * @returns {Promise}
     */
    async syncAccounts() {
        this.eventEmitter.emit(EventTypes.LOG_SYNC_DATA, new SyncLogRecordModel(
            Date.now(),
            SyncDataOperation.SYNC_FROM_ERP,
            SyncDataState.START,
            SyncDataItem.ACCOUNT
        ));

        let completeStatus = null;

        try {
            const accounts = await this.loaders.accountLoader.load(this.connection);

            await this.storages.accountStorage.persist(accounts);
        }
        catch (error) {
            completeStatus = new SyncCompleteStatus(error);

            throw error;
        }
        finally {
            this.eventEmitter.emit(EventTypes.LOG_SYNC_DATA, new SyncLogRecordModel(
                Date.now(),
                SyncDataOperation.SYNC_FROM_ERP,
                SyncDataState.START,
                SyncDataItem.ACCOUNT,
                completeStatus
            ));
        }
    }

    /**
     * @returns {Promise}
     */
    async syncVendors() {
        this.eventEmitter.emit(EventTypes.LOG_SYNC_DATA, new SyncLogRecordModel(
            Date.now(),
            SyncDataOperation.SYNC_FROM_ERP,
            SyncDataState.START,
            SyncDataItem.VENDOR
        ));

        let completeStatus = null;

        try {
            const vendors = await this.loaders.vendorLoader.load(this.connection);

            await this.storages.vendorStorage.persist(vendors);
        }
        catch (error) {
            completeStatus = new SyncCompleteStatus(error);

            throw error;
        }
        finally {
            this.eventEmitter.emit(EventTypes.LOG_SYNC_DATA, new SyncLogRecordModel(
                Date.now(),
                SyncDataOperation.SYNC_FROM_ERP,
                SyncDataState.START,
                SyncDataItem.VENDOR,
                completeStatus
            ));
        }
    }
}

export default XeroDataSyncManager;