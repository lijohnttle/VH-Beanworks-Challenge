import EventTypes from './EventType';
import NotificationType from '../constants/NotificationType';
import ServerContext from '../server/ServerContext';

/**
 * 
 * @param {ServerContext} serverContext
 */
function subscribe(serverContext) {
    const { eventEmitter} = serverContext;

    eventEmitter.on(EventTypes.SYNC_DATA_STARTED, () => {
        const { io } = serverContext;

        io.emit(NotificationType.SYNC_DATA_STARTED);
    });

    eventEmitter.on(EventTypes.SYNC_DATA_UPDATE, session => {
        const { storages, io } = serverContext;

        storages.syncDataSessionsStorage.persist([ session ]);
        
        io.emit(NotificationType.SYNC_DATA_UPDATE, session);
    });

    eventEmitter.on(EventTypes.SYNC_DATA_COMPLETE, session => {
        const { storages, io } = serverContext;

        storages.syncDataSessionsStorage.persist([ session ]);

        io.emit(NotificationType.SYNC_DATA_COMPLETE, session);
    });
}

export default {
    subscribe
}