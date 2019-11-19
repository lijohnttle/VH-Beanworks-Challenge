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
import { useRepositories } from '../services/persistence/mongodb';
import DataSyncManager from '../services/dataSync/DataSyncManager';
import ServerContext from './ServerContext';
import * as DataSyncEventHandler from '../events/DataSyncEventHandler';
import XeroDataImporter from '../services/dataImport/xero/XeroDataImporter';
import DataSyncSessionArchiver from '../services/dataSync/DataSyncSessionArchiver';


// utils
const rootPath = process.cwd();
const eventEmitter = new EventEmitter();


// app
const config = loadConfig(process.env.NODE_ENV);
const serverContext = new ServerContext(config, useRepositories(config), eventEmitter);
const app = express();

const xeroConnection = new XeroConnection(config.xero);
const importer = new XeroDataImporter(xeroConnection, new XeroAccountLoader(), new XeroVendorLoader());
const dataSyncArchiver = new DataSyncSessionArchiver();
const syncManager = new DataSyncManager(serverContext, importer, dataSyncArchiver);


// event handlers
DataSyncEventHandler.subscribe(serverContext);


// routes
app.use(express.static(path.resolve(rootPath, 'public')));

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: useResolvers(serverContext, syncManager),
    graphiql: true
}));

app.get('/archives/:sessionId/:dataSyncItem', async (req, res) => {
    const data = await syncManager.getArchive(req.params.sessionId, req.params.dataSyncItem);
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

serverContext.configureIo(io);