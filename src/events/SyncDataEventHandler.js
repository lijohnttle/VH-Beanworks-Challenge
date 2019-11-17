import EventTypes from './EventType';
import NotificationType from '../constants/NotificationType';
import ServerContext from '../server/ServerContext';

/**
 * 
 * @param {ServerContext} serverContext
 */
function subscribe(serverContext) {
    const { eventEmitter} = serverContext;

    eventEmitter.on(EventTypes.LOG_SYNC_DATA, syncLogRecord => {
        const { storages } = serverContext;

        storages.syncLogStorage.persist([ syncLogRecord ]);
    });

    eventEmitter.on(EventTypes.SYNC_DATA_STARTED, () => {
        const { io} = serverContext;

        io.emit(NotificationType.SYNC_DATA_STARTED);
    });

    eventEmitter.on(EventTypes.SYNC_DATA_COMPLETE, () => {
        const { io} = serverContext;

        io.emit(NotificationType.SYNC_DATA_COMPLETE);
    });
}

export default {
    subscribe
}