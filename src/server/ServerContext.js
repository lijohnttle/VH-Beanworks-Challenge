import { EventEmitter } from 'events';
import socketIo from 'socket.io';

export default class ServerContext {
    /**
     * 
     * @param {Object} config
     * @param {Object} storages 
     * @param {EventEmitter} eventEmitter 
     */
    constructor(config, storages, eventEmitter) {
        this.config = config;
        this.storages = storages;
        this.eventEmitter = eventEmitter;
        this.io = null;
    }

    /**
     * 
     * @param {socketIo.Server} io 
     */
    configureIo(io) {
        this.io = io;
    }
}