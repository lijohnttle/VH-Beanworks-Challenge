import { XeroAccountLoader, XeroVendorLoader } from './loaders';
import XeroConnection from './XeroConnection';
import DataImportType from '../DataImportType';
import DataImportStatus from '../DataImportStatus';

/**
 * 
 * @callback dataLoadedCallback
 * 
 * @param {String} dataType
 * @param {String} status
 * @param {Object[]} data
 * @param {Error} error 
 * 
 * @returns {Promise}
 */

/**
 * 
 * @param {XeroConnection} connection 
 * @param {String} dataType 
 * @param {Object} dataLoader
 * @param {dataLoadedCallback} dataLoadedCallback
 */
async function loadData(dataType, dataLoader, connection, dataLoadedCallback) {
    try {
        await dataLoadedCallback(dataType, DataImportStatus.STARTING, data, null);

        const data = await dataLoader.load(connection);

        await dataLoadedCallback(dataType, DataImportStatus.FINISHED, data, null);
    }
    catch (error) {
        await dataLoadedCallback(dataType, DataImportStatus.FINISHED, null, error);
    }
}

class XeroDataImporter {
    /**
     * 
     * @param {XeroConnection} connection 
     * @param {XeroAccountLoader} accountLoader 
     * @param {XeroVendorLoader} vendorLoader 
     */
    constructor(connection, accountLoader, vendorLoader) {
        this.connection = connection;
        this.accountLoader = accountLoader;
        this.vendorLoader = vendorLoader;
    }
    /**
     * 
     * @param {dataLoadedCallback} dataLoadedCallback
     * 
     * @returns {Promise}
     */
    async import(dataLoadedCallback) {
        await Promise.all(
            [
                loadData(DataImportType.ACCOUNTS, this.accountLoader, this.connection, dataLoadedCallback),
                loadData(DataImportType.VENDORS, this.vendorLoader, this.connection, dataLoadedCallback)
            ]
        );
    }
}

export default XeroDataImporter;