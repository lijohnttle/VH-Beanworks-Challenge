import { EventEmitter } from "events";
import EventTypes from './EventType';
import SyncLogMemoryStorage from '../persistence/memory/SyncLogMemoryStorage';

/**
 * @param {EventEmitter} eventEmitter
 * @param {SyncLogMemoryStorage} syncLogStorage 
 */
function subscribe(eventEmitter, syncLogStorage) {
    eventEmitter.on(EventTypes.LOG_SYNC_DATA, syncLogRecord => {
        syncLogStorage.persist([ syncLogRecord ]);

        // TODO: send notifications
    });
}

export default {
    subscribe
}