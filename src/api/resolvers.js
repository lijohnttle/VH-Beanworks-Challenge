import XeroDataSyncManager from '../services/XeroDataSyncManager';

/**
 * @param {XeroDataSyncManager} syncManager 
 */
function useResolvers(syncManager) {
    const resolvers = {
        syncDataFromErp: async () => {
            await syncManager.syncAll();

            return true;
        }
    };

    return resolvers;
}

export { useResolvers };