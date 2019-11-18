import DataSyncCompleteStatus from './DataSyncCompleteStatus';

class DataSyncLogRecordModel {
    /**
     * @param {Date} timestamp 
     * @param {String} operation 
     * @param {String} state 
     * @param {DataSyncCompleteStatus} completeStatus 
     */
    constructor(timestamp, operation, state, item, status = null) {
        this.timestamp = timestamp;
        this.operation = operation;
        this.state = state;
        this.item = item;
        this.status = status;
    }
}

export default DataSyncLogRecordModel;