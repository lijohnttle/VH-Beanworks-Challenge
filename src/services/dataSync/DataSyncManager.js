import XeroDataImporter from '../dataImport/xero/XeroDataImporter';
import DataImportItem from '../dataImport/DataImportItem';
import DataImportStatus from '../dataImport/DataImportStatus';
import ServerContext from '../../server/ServerContext';
import EventTypes from '../../events/EventType';
import SyncDataOperation from '../../constants/SyncDataOperation';
import DataSyncState from './DataSyncState';
import DataSyncItem from './DataSyncItem';
import SyncLogRecordModel from '../../models/SyncLogRecordModel';
import SyncCompleteStatus from '../../models/SyncCompleteStatus';
import SyncDataSessionModel from '../../models/SyncDataSessionModel';
import DataSyncSessionStatus from '../../models/DataSyncSessionStatus';
import uuidv1 from 'uuid/v1';

/**
 * 
 * @param {String} dataImportType
 * 
 * @returns {String}
 */
function convertDataImportItemToDataSyncItem(dataImportItem) {
    switch (dataImportItem) {
        case DataImportItem.ACCOUNT_LIST:
            return DataSyncItem.ACCOUNT;

        case DataImportItem.VENDOR_LIST:
            return DataSyncItem.VENDOR;
    }

    throw new Error(`Uknown DataImportItem: ${dataImportItem}`);
}

/**
 * 
 * @param {String} dataSyncItem
 * 
 * @returns {Object}
 */
function getStorageByDataSyncItem(dataSyncItem, storages) {
    if (dataSyncItem === DataSyncItem.ACCOUNT) {
        return storages.accountStorage;
    }
    else if (dataSyncItem === DataSyncItem.VENDOR) {
        return storages.vendorStorage;
    }
}


export default class DataSyncManager {
    /**
     * @param {ServerContext} serverContext
     * @param {XeroDataImporter} dataImporter
     */
    constructor(serverContext, dataImporter) {
        this.serverContext = serverContext;
        this.dataImporter = dataImporter;
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

        const { eventEmitter } = this.serverContext;

        try {
            const self = this;

            // start data synchronization process
            eventEmitter.emit(EventTypes.SYNC_DATA_STARTED);
            this.activeSession = new SyncDataSessionModel(uuidv1(), DataSyncSessionStatus.ACTIVE, Date.now());
            eventEmitter.emit(EventTypes.SYNC_DATA_UPDATE, this.activeSession);
            
            // import data
            await this.dataImporter.import(async (importItem, status, data, error) => {
                if (error) {
                    console.error(error);
                    return;
                }

                const dataSyncItem = convertDataImportItemToDataSyncItem(importItem);

                if (status === DataImportStatus.STARTING) {
                    self._startSyncList(dataSyncItem);
                }
                else {
                    await self._completeSyncList(dataSyncItem, data);
                }
            });

            this.activeSession.status = DataSyncSessionStatus.COMPLETE;
        }
        catch (error) {
            console.error(error);

            this.activeSession.status = DataSyncSessionStatus.ERROR;
        }
        finally {
            // complete data synchronization process
            const completedSession = this.activeSession;
            this.activeSession = null;
            eventEmitter.emit(EventTypes.SYNC_DATA_COMPLETE, completedSession);
        }
    }

    /**
     * 
     * @param {DataSyncItem} dataSyncItem
     */
    _startSyncList(dataSyncItem) {
        const { eventEmitter } = this.serverContext;

        this.activeSession.addLogRecord(new SyncLogRecordModel(
            Date.now(),
            SyncDataOperation.SYNC_FROM_ERP,
            DataSyncState.START,
            dataSyncItem
        ));

        eventEmitter.emit(EventTypes.SYNC_DATA_UPDATE, this.activeSession);
    }

    /**
     * 
     * @param {DataSyncItem} dataSyncItem
     * @param {Object[]} data
     * 
     * @returns {Promise}
     */
    async _completeSyncList(dataSyncItem, data) {
        const { eventEmitter } = this.serverContext;

        let completeStatus = null;
        const storage = getStorageByDataSyncItem(dataSyncItem, this.serverContext.storages);

        try {
            
            await storage.persist(data);
        }
        catch (error) {
            completeStatus = new SyncCompleteStatus(error);

            throw error;
        }
        finally {
            this.activeSession.addLogRecord(new SyncLogRecordModel(
                Date.now(),
                SyncDataOperation.SYNC_FROM_ERP,
                DataSyncState.END,
                dataSyncItem,
                completeStatus
            ));

            eventEmitter.emit(EventTypes.SYNC_DATA_UPDATE, this.activeSession);
        }
    }
}