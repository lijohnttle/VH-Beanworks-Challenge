import DataSyncLogRecordModel from './DataSyncLogRecordModel';

export default class DataSyncSessionModel {
    constructor(sessionID, status, startedUTC, syncLog = []) {
        this.sessionID = sessionID;
        this.status = status;
        this.startedUTC = startedUTC;
        this.syncLog = syncLog;
    }

    /**
     * 
     * @param {DataSyncLogRecordModel} record
     */
    addLogRecord(record) {
        this.syncLog.push(record);
    }
}