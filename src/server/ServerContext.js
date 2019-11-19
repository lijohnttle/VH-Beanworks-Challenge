import { EventEmitter } from 'events';
import socketIo from 'socket.io';

export default class ServerContext {
    /**
     * 
     * @param {Object} config
     * @param {Object} repositories 
     * @param {EventEmitter} eventEmitter 
     */
    constructor(config, repositories, eventEmitter) {
        this.config = config;
        this.repositories = repositories;
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