import XeroSyncManager from '../../../src/integrations/xero/XeroSyncManager';
import JestMock from 'jest-mock';

describe('XeroSyncManager', () => {
    it('should test that response has been persisted', async () => {
        const connection = { };
        const models = [{ id: 1 }, { id: 2 }];
        const loadMock = JestMock.fn(c => models);
        const loader = {
            load: loadMock
        };
        const persistMock = JestMock.fn(items => { });
        const storage = {
            persist: persistMock
        };
        const syncManager = new XeroSyncManager(connection);

        await syncManager.sync(loader, storage);

        expect(loadMock.mock.calls.length).toBe(1);
        expect(loadMock.mock.calls[0][0]).toBe(connection);
        expect(persistMock.mock.calls.length).toBe(1);
        expect(persistMock.mock.calls[0][0]).toBe(models);
    });
});