import DataSyncManager from '../../../src/services/dataSync/DataSyncManager';
import JestMock from 'jest-mock';
import EventType from '../../../src/events/EventType';
import DataSyncSessionStatus from '../../../src/models/DataSyncSessionStatus';
import DataImportItem from '../../../src/services/dataImport/DataImportItem';
import DataImportStatus from '../../../src/services/dataImport/DataImportStatus';
import DataSyncItem from '../../../src/services/dataSync/DataSyncItem';
import DataSyncOperation from '../../../src/services/dataSync/DataSyncOperation';
import DataSyncState from '../../../src/services/dataSync/DataSyncState';

describe('synchronizing data', () => {
    it('start sync process should update active session and send STARTED and UPDATE events', async () => {
        let session = null;
        const eventEmitterEmitMock = JestMock.fn(eventType => {
            if (eventType === EventType.SYNC_DATA_UPDATE) {
                expect(syncManager.activeSession.status).toBe(DataSyncSessionStatus.ACTIVE);
                
                if (!session) {
                    session = syncManager.activeSession;
                }
            }
        });
        const importMock = JestMock.fn(() => Promise.resolve());
        const serverContext = {
            eventEmitter: {
                emit: eventEmitterEmitMock
            }
        };
        const dataImporter = {
            import: importMock
        };
        const syncManager = new DataSyncManager(serverContext, dataImporter);


        await syncManager.syncData();


        expect(eventEmitterEmitMock.mock.calls.length).toBe(3);
        expect(eventEmitterEmitMock.mock.calls[0][0]).toBe(EventType.SYNC_DATA_STARTED);
        expect(eventEmitterEmitMock.mock.calls[1][0]).toBe(EventType.SYNC_DATA_UPDATE);
        expect(eventEmitterEmitMock.mock.calls[2][0]).toBe(EventType.SYNC_DATA_COMPLETE);
        expect(session.status).toBe(DataSyncSessionStatus.COMPLETE);
    });

    [DataImportItem.ACCOUNT_LIST, DataImportItem.VENDOR_LIST].forEach(dataImportItem =>
        it(`starting import of the ${dataImportItem} should add log record to active session and send UPDATE`, async () => {
            let session = null;
            const eventEmitterEmitMock = JestMock.fn(eventType => {
                if (eventType === EventType.SYNC_DATA_UPDATE) {
                    expect(syncManager.activeSession.status).toBe(DataSyncSessionStatus.ACTIVE);

                    if (!session) {
                        session = syncManager.activeSession;
                    }
                }
            });
            const importMock = JestMock.fn(dataLoadedCallback =>
                Promise.resolve(dataLoadedCallback(dataImportItem, DataImportStatus.STARTING, null, null)));
            const serverContext = {
                eventEmitter: {
                    emit: eventEmitterEmitMock
                }
            };
            const dataImporter = {
                import: importMock
            };
            const syncManager = new DataSyncManager(serverContext, dataImporter);


            await syncManager.syncData();


            expect(eventEmitterEmitMock.mock.calls[2][0]).toBe(EventType.SYNC_DATA_UPDATE);
            expect(session.syncLog.length).toBe(1);
            expect(session.syncLog[0]).toMatchObject({
                operation: DataSyncOperation.SYNC_FROM_ERP,
                state: DataSyncState.START,
                item: dataImportItem === DataImportItem.ACCOUNT_LIST
                    ? DataSyncItem.ACCOUNT
                    : DataSyncItem.VENDOR
            });
        })
    );

    [DataImportItem.ACCOUNT_LIST, DataImportItem.VENDOR_LIST].forEach(dataImportItem =>
        it(`finishing import of the ${dataImportItem} should persist data, add log record to active session and send UPDATE`, async () => {
            let session = null;
            const eventEmitterEmitMock = JestMock.fn(eventType => {
                if (eventType === EventType.SYNC_DATA_UPDATE) {
                    expect(syncManager.activeSession.status).toBe(DataSyncSessionStatus.ACTIVE);

                    if (!session) {
                        session = syncManager.activeSession;
                    }
                }
            });
            const importMock = JestMock.fn(dataLoadedCallback =>
                Promise.resolve(dataLoadedCallback(dataImportItem, DataImportStatus.FINISHED, null, null)));
            const accountsPersistMock = JestMock.fn(() => Promise.resolve());
            const vendorsPersistMock = JestMock.fn(() => Promise.resolve());
            const serverContext = {
                eventEmitter: {
                    emit: eventEmitterEmitMock
                },
                storages: {
                    accountStorage: {
                        persist: accountsPersistMock
                    },
                    vendorStorage: {
                        persist: vendorsPersistMock
                    }
                }
            };
            const dataImporter = {
                import: importMock
            };
            const syncManager = new DataSyncManager(serverContext, dataImporter);


            await syncManager.syncData();


            if (dataImportItem === DataImportItem.ACCOUNT_LIST) {
                expect(accountsPersistMock.mock.calls.length).toBe(1);
            }
            else if (dataImportItem === DataImportItem.VENDOR_LIST) {
                expect(vendorsPersistMock.mock.calls.length).toBe(1);
            }
            expect(eventEmitterEmitMock.mock.calls[2][0]).toBe(EventType.SYNC_DATA_UPDATE);
            expect(session.syncLog.length).toBe(1);
            expect(session.syncLog[0]).toMatchObject({
                operation: DataSyncOperation.SYNC_FROM_ERP,
                state: DataSyncState.END,
                item: dataImportItem === DataImportItem.ACCOUNT_LIST
                    ? DataSyncItem.ACCOUNT
                    : DataSyncItem.VENDOR
            });
        })
    );
});