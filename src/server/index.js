import path from 'path';
import express from 'express';
import { loadConfig } from './config';
import XeroConnection from '../integrations/xero/XeroConnection';
import { subscribeEvents, eventEmitter } from './events';


// utils
const rootPath = process.cwd();


// app
const config = loadConfig(process.env.NODE_ENV);
const app = express();

const xeroConnection = new XeroConnection(config.xero);


// event handlers
subscribeEvents();


// routes
app.use(express.static(path.resolve(rootPath, 'public')));

app.get('/', (_, res) => {
    res.setHeader('content-type', 'text/html');
    res.sendFile(path.resolve(rootPath, 'public/index.html'));
});


app.listen(config.server.port, () => {
    console.log(`Server is listening on port ${config.server.port}`);
});