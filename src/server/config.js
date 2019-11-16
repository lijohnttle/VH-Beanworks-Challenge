import fs from 'fs';
import path from 'path';

export function loadConfig(environment) {
    const configsPath = path.resolve(process.cwd(), 'configs', environment);
    const serverConfigJson = fs.readFileSync(path.resolve(configsPath, 'server.config.json'));
    const xeroConfigJson = fs.readFileSync(path.resolve(configsPath, 'xero.config.json'));

    const serverConfig = JSON.parse(serverConfigJson);
    const xeroConfig = JSON.parse(xeroConfigJson);

    xeroConfig.privateKeyPath = path.resolve(process.cwd(), xeroConfig.privateKeyPath);

    return {
        server: serverConfig,
        xero: xeroConfig
    };
};