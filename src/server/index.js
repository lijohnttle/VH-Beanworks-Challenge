import path from 'path';
import express from 'express';
import { loadConfig } from './config';
import { XeroAccountLoader, XeroVendorLoader } from '../integrations/xero/loaders';
import { XeroConnection, XeroSyncManager } from '../integrations/xero';
import AccountStorage from '../persistence/memory/AccountMemoryStorage';
import VendorStorage from '../persistence/memory/VendorMemoryStorage';


// utils
const rootPath = process.cwd();


// app
const config = loadConfig(process.env.NODE_ENV);
const app = express();

const xeroConnection = new XeroConnection(config.xero);


// routes
app.use(express.static(path.resolve(rootPath, 'public')));

app.get('/', (_, res) => {
    res.setHeader('content-type', 'text/html');
    res.sendFile(path.resolve(rootPath, 'public/index.html'));
});


app.listen(config.server.port, () => {
    console.log(`Server is listening on port ${config.server.port}`);
});

(async function() {
    const accountStorage = new AccountStorage();
    const vendorStorage = new VendorStorage();

    const xeroSyncManager = new XeroSyncManager(xeroConnection);

    await xeroSyncManager.sync(new XeroAccountLoader(), accountStorage);
    await xeroSyncManager.sync(new XeroVendorLoader(), vendorStorage);
    
    console.log(vendorStorage.items);
})();