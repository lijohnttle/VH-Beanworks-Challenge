import { EventEmitter } from 'events';
import storages from './storages';
import LogSyncDataEventHandler from '../events/LogSyncDataEventHandler';

export const eventEmitter = new EventEmitter();

export function subscribeEvents() {
    LogSyncDataEventHandler.subscribe(eventEmitter, storages.syncLogStorage);
}