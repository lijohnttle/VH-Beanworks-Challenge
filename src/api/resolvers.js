import ServerContext from '../server/ServerContext';
import XeroDataSyncManager from '../services/XeroDataSyncManager';

/**
 * @param {ServerContext} context
 * @param {XeroDataSyncManager} syncManager 
 */
function useResolvers(context, syncManager) {
    const resolvers = {
        getSyncDataState: async () => {
            const sessions = await context.storages.syncDataSessionsStorage.getItems();

            return {
                notificationsEndpoint: context.config.server.socketUrl,
                isSyncRunning: syncManager.activeSession != null,
                sessions: sessions.slice().reverse().map(session => ({
                    sessionID: session.sessionID,
                    status: session.status,
                    startedUTC: session.startedUTC
                }))
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