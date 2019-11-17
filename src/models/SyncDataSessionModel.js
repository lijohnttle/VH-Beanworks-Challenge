import SyncLogRecordModel from './SyncLogRecordModel';

export default class SyncDataSessionModel {
    constructor(sessionID, status, startedUTC, syncLog = []) {
        this.sessionID = sessionID;
        this.status = status;
        this.startedUTC = startedUTC;
        this.syncLog = syncLog;
    }

    /**
     * 
     * @param {SyncLogRecordModel} record
     */
    addLogRecord(record) {
        this.syncLog.push(record);
    }
}