import XeroDataImporter from '../dataImport/xero/XeroDataImporter';
import DataImportType from '../dataImport/DataImportType';
import DataImportStatus from '../dataImport/DataImportStatus';
import ServerContext from '../../server/ServerContext';
import EventTypes from '../../events/EventType';
import SyncDataOperation from '../../constants/SyncDataOperation';
import SyncDataState from '../../constants/SyncDataState';
import SyncDataItem from '../../constants/SyncDataItem';
import SyncLogRecordModel from '../../models/SyncLogRecordModel';
import SyncCompleteStatus from '../../models/SyncCompleteStatus';
import SyncDataSessionModel from '../../models/SyncDataSessionModel';
import uuidv1 from 'uuid/v1';


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

        try {
            const self = this;
            
            this._startSync();

            await this.dataImporter.import(async (dataType, status, data, error) => {
                if (error) {
                    console.error(error);
                    return;
                }

                if (dataType === DataImportType.ACCOUNTS) {
                    if (status === DataImportStatus.STARTING) {
                        self._startSyncList(SyncDataItem.ACCOUNT);
                    }
                    else {
                        await self._completeSyncList(SyncDataItem.ACCOUNT, data, this.serverContext.storages.accountStorage);
                    }
                }
                else if (dataType === DataImportType.VENDORS) {
                    if (status === DataImportStatus.STARTING) {
                        self._startSyncList(SyncDataItem.VENDOR);
                    }
                    else {
                        await self._completeSyncList(SyncDataItem.VENDOR, data, this.serverContext.storages.vendorStorage);
                    }
                }
            });
        }
        catch (error) {
            console.error(error);
        }
        finally {
            this._completeSync();
        }
    }

    _startSync() {
        this.serverContext.eventEmitter.emit(EventTypes.SYNC_DATA_STARTED);
        this.activeSession = new SyncDataSessionModel(uuidv1(), 'ACTIVE', Date.now());
        this.serverContext.eventEmitter.emit(EventTypes.SYNC_DATA_UPDATE, this.activeSession);
    }

    _completeSync() {
        const completedSession = this.activeSession;
        completedSession.status = 'COMPLETE'; 
        this.activeSession = null;
        this.serverContext.eventEmitter.emit(EventTypes.SYNC_DATA_COMPLETE, completedSession);
    };

    /**
     * 
     * @param {SyncDataItem} item
     */
    _startSyncList(item) {
        const { eventEmitter } = this.serverContext;

        this.activeSession.addLogRecord(new SyncLogRecordModel(
            Date.now(),
            SyncDataOperation.SYNC_FROM_ERP,
            SyncDataState.START,
            item
        ));

        eventEmitter.emit(EventTypes.SYNC_DATA_UPDATE, this.activeSession);
    }

    /**
     * 
     * @param {SyncDataItem} item
     * @param {Object[]} data
     * @param {Object} storage
     * 
     * @returns {Promise}
     */
    async _completeSyncList(item, data, storage) {
        const { eventEmitter } = this.serverContext;

        let completeStatus = null;

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
                SyncDataState.END,
                item,
                completeStatus
            ));

            eventEmitter.emit(EventTypes.SYNC_DATA_UPDATE, this.activeSession);
        }
    }
}