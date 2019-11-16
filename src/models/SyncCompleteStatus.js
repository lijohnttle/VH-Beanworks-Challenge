class SyncCompleteStatus {
    constructor(successfulRecords, failedRecords, totalRecords, error) {
        this.successfulRecords = successfulRecords;
        this.failedRecords = failedRecords;
        this.totalRecords = totalRecords;
        this.error = error;
    }
}

export default SyncCompleteStatus;