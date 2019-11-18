import ServerContext from '../server/ServerContext';
import DataSyncManager from '../services/dataSync/DataSyncManager';

/**
 * @param {ServerContext} context
 * @param {DataSyncManager} syncManager 
 */
function useResolvers(context, syncManager) {
    const resolvers = {
        getDataSyncState: async () => {
            const sessions = await context.storages.syncDataSessionsStorage.getItems();

            return {
                notificationsEndpoint: context.config.server.socketUrl,
                isSyncRunning: syncManager.activeSession != null,
                sessions: sessions.slice().reverse().map(session => ({
                    sessionID: session.sessionID,
                    status: session.status,
                    startedUTC: session.startedUTC,
                    syncLog: session.syncLog
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