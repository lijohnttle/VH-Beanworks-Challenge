import ServerContext from '../server/ServerContext';
import XeroDataSyncManager from '../services/XeroDataSyncManager';

/**
 * @param {ServerContext} context
 * @param {XeroDataSyncManager} syncManager 
 */
function useResolvers(context, syncManager) {
    const resolvers = {
        getSyncDataState: () => {
            return {
                notificationsEndpoint: context.config.server.socketUrl,
                isSyncRunning: false
            };
        },
        syncDataFromErp: async () => {
            await syncManager.syncData();

            return true;
        }
    };

    return resolvers;
}

export { useResolvers };