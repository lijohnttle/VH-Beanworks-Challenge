import http from 'http';

export default class NotificationContext {
    constructor() {
        this.io = null;
    }

    /**
     * 
     * @param {http.Server} server 
     */
    configure(server) {
        this.io = socketIo(server, { serveClient: false });
    }
}