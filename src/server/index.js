import path from 'path';
import express from 'express';
import socketIo from 'socket.io';
import { loadConfig } from './config';
import XeroConnection from '../integrations/xero/XeroConnection';
import { EventEmitter } from 'events';
import graphqlHTTP from 'express-graphql';
import { schema } from '../api/schema';
import { useResolvers } from '../api/resolvers';
import { useStorages } from '../persistence/mongodb';
import XeroDataSyncManager from '../services/XeroDataSyncManager';
import ServerContext from './ServerContext';
import XeroConnectionContext from '../services/XeroConnectionContext';
import SyncDataEventHandler from '../events/SyncDataEventHandler';
import NotificationType from '../constants/NotificationType';


// utils
const rootPath = process.cwd();
const eventEmitter = new EventEmitter();


// app
const config = loadConfig(process.env.NODE_ENV);
const serverContext = new ServerContext(config, useStorages(config), eventEmitter);
const app = express();

const xeroConnection = new XeroConnection(config.xero);
const xeroContext = new XeroConnectionContext({
    accountLoader: new XeroAccountLoader(),
    vendorLoader: new XeroVendorLoader()
}, xeroConnection);
const syncManager = new XeroDataSyncManager(serverContext, xeroContext);


// event handlers
SyncDataEventHandler.subscribe(serverContext);


// routes
app.use(express.static(path.resolve(rootPath, 'public')));

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: useResolvers(serverContext, syncManager),
    graphiql: true
}));

app.get('/', (_, res) => {
    res.setHeader('content-type', 'text/html');
    res.sendFile(path.resolve(rootPath, 'public/index.html'));
});


const server = app.listen(config.server.port, () => {
    console.log(`Server is listening on port ${config.server.port}`);
});

const io = socketIo(server, { serveClient: false });

io.on('connection', socket => {
    socket.on(NotificationType.JOIN_ROOM, room => {
        socket.join(room);
    });
});

serverContext.configureIo(io);