import EventTypes from './EventType';
import NotificationType from '../notifications/NotificationType';
import ServerContext from '../server/ServerContext';

/**
 * 
 * @param {ServerContext} serverContext
 */
export function subscribe(serverContext) {
    const { eventEmitter} = serverContext;

    eventEmitter.on(EventTypes.SYNC_DATA_STARTING, () => {
        const { io } = serverContext;

        io.emit(NotificationType.SYNC_DATA_STARTED);
    });

    eventEmitter.on(EventTypes.SYNC_DATA_STARTED, session => {
        const { repositories, io } = serverContext;

        repositories.dataSyncSessions.persist([ session ]);
        
        io.emit(NotificationType.SYNC_DATA_UPDATE, session);
    });

    eventEmitter.on(EventTypes.SYNC_DATA_UPDATE, session => {
        const { repositories, io } = serverContext;

        repositories.dataSyncSessions.persistSyncLog([ session ]);
        
        io.emit(NotificationType.SYNC_DATA_UPDATE, session);
    });

    eventEmitter.on(EventTypes.SYNC_DATA_COMPLETE, session => {
        const { repositories, io } = serverContext;

        repositories.dataSyncSessions.persistStatus([ session ]);

        io.emit(NotificationType.SYNC_DATA_COMPLETE, session);
    });
}