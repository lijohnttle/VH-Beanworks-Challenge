import XeroDataImporter from '../dataImport/xero/XeroDataImporter';
import DataImportItem from '../dataImport/DataImportItem';
import DataImportStatus from '../dataImport/DataImportStatus';
import ServerContext from '../../server/ServerContext';
import EventTypes from '../../events/EventType';
import DataSyncOperation from './DataSyncOperation';
import DataSyncState from './DataSyncState';
import DataSyncItem from './DataSyncItem';
import DataSyncLogRecordModel from '../../models/DataSyncLogRecordModel';
import DataSyncCompleteStatus from '../../models/DataSyncCompleteStatus';
import DataSyncSessionModel from '../../models/DataSyncSessionModel';
import DataSyncSessionStatus from '../../models/DataSyncSessionStatus';
import DataSyncSessionArchiver from './DataSyncSessionArchiver';
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
function getRepositoryByDataSyncItem(dataSyncItem, repositories) {
    if (dataSyncItem === DataSyncItem.ACCOUNT) {
        return repositories.accounts;
    }
    else if (dataSyncItem === DataSyncItem.VENDOR) {
        return repositories.vendors;
    }
}


export default class DataSyncManager {
    /**
     * @param {ServerContext} serverContext
     * @param {XeroDataImporter} dataImporter
     * @param {DataSyncSessionArchiver} dataArchiver
     */
    constructor(serverContext, dataImporter, dataArchiver) {
        this.serverContext = serverContext;
        this.dataImporter = dataImporter;
        this.dataArchiver = dataArchiver;
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
            eventEmitter.emit(EventTypes.SYNC_DATA_STARTING);
            this.activeSession = new DataSyncSessionModel(uuidv1(), DataSyncSessionStatus.ACTIVE, Date.now());
            eventEmitter.emit(EventTypes.SYNC_DATA_STARTED, this.activeSession);
            
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

    getArchive(sessionID, dataSyncItem) {
        return this.dataArchiver.getArchive(sessionID, dataSyncItem);
    }

    /**
     * 
     * @param {DataSyncItem} dataSyncItem
     */
    _startSyncList(dataSyncItem) {
        const { eventEmitter } = this.serverContext;

        this.activeSession.addLogRecord(new DataSyncLogRecordModel(
            Date.now(),
            DataSyncOperation.SYNC_FROM_ERP,
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
        const repository = getRepositoryByDataSyncItem(dataSyncItem, this.serverContext.repositories);

        try {
            await repository.persist(data);
            
            this.dataArchiver.archive(this.activeSession.sessionID, dataSyncItem, data);
        }
        catch (error) {
            completeStatus = new DataSyncCompleteStatus(error);

            throw error;
        }
        finally {
            this.activeSession.addLogRecord(new DataSyncLogRecordModel(
                Date.now(),
                DataSyncOperation.SYNC_FROM_ERP,
                DataSyncState.END,
                dataSyncItem,
                completeStatus
            ));

            eventEmitter.emit(EventTypes.SYNC_DATA_UPDATE, this.activeSession);
        }
    }
}