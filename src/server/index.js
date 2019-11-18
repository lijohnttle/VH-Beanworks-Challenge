import path from 'path';
import express from 'express';
import socketIo from 'socket.io';
import { loadConfig } from './config';
import { XeroAccountLoader, XeroVendorLoader } from '../services/dataImport/xero/loaders';
import XeroConnection from '../services/dataImport/xero/XeroConnection';
import { EventEmitter } from 'events';
import graphqlHTTP from 'express-graphql';
import { schema } from '../api/schema';
import { useResolvers } from '../api/resolvers';
import { useStorages } from '../persistence/mongodb';
import DataSyncManager from '../services/dataSync/DataSyncManager';
import ServerContext from './ServerContext';
import * as DataSyncEventHandler from '../events/DataSyncEventHandler';
import NotificationType from '../constants/NotificationType';
import XeroDataImporter from '../services/dataImport/xero/XeroDataImporter';


// utils
const rootPath = process.cwd();
const eventEmitter = new EventEmitter();


// app
const config = loadConfig(process.env.NODE_ENV);
const serverContext = new ServerContext(config, useStorages(config), eventEmitter);
const app = express();

const xeroConnection = new XeroConnection(config.xero);
const importer = new XeroDataImporter(xeroConnection, new XeroAccountLoader(), new XeroVendorLoader())
const syncManager = new DataSyncManager(serverContext, importer);


// event handlers
DataSyncEventHandler.subscribe(serverContext);


// routes
app.use(express.static(path.resolve(rootPath, 'public')));

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: useResolvers(serverContext, syncManager),
    graphiql: true
}));

app.get('/archives/:sessionId', async (req, res) => {
    const data = await syncManager.getArchive(req.params.sessionId);
    res.json(data);
});

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