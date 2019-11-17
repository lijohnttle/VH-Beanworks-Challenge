import path from 'path';
import express from 'express';
import socketIo from 'socket.io';
import { loadConfig } from './config';
import XeroConnection from '../integrations/xero/XeroConnection';
import { subscribeEvents, eventEmitter } from './events';
import graphqlHTTP from 'express-graphql';
import { schema } from '../api/schema';
import { useResolvers } from '../api/resolvers';
import loaders from '../integrations/xero/loaders';
import storages from '../persistence/memory';
import XeroDataSyncManager from '../services/XeroDataSyncManager';


// utils
const rootPath = process.cwd();


// app
const config = loadConfig(process.env.NODE_ENV);
const app = express();

const xeroConnection = new XeroConnection(config.xero);
const syncManager = new XeroDataSyncManager(
    loaders,
    storages,
    eventEmitter,
    xeroConnection
);


// event handlers
subscribeEvents();


// routes
app.use(express.static(path.resolve(rootPath, 'public')));

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: useResolvers(syncManager),
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
    console.log('connected');

    socket.on('disconnect', () => console.log('disconnected'));
});