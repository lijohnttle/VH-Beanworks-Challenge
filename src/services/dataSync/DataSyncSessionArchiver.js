import path from 'path';
import fs from 'fs';

class DataSyncSessionArchiver {
    archive(sessionID, dataSyncItem, data) {
        const archiveDirectory = path.resolve(process.cwd(), 'archives');
        const archiveFileName = `${sessionID}_${dataSyncItem}.json`;
        const archivePath = path.resolve(archiveDirectory, archiveFileName);

        fs.mkdir(archiveDirectory, { recursive: true }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                fs.writeFile(archivePath, JSON.stringify(data), err => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    }

    /**
     * 
     * @param {String} sessionID
     * 
     * @return {Promise} 
     */
    async getArchive(sessionID, dataSyncItem) {
        const archiveDirectory = path.resolve(process.cwd(), 'archives');
        const archiveFileName = `${sessionID}_${dataSyncItem}.json`;
        const archivePath = path.resolve(archiveDirectory, archiveFileName);

        return new Promise((resolve, reject) => {
            if (fs.existsSync(archivePath)) {
                fs.readFile(archivePath, 'utf8', (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            }
            else {
                resolve('');
            }
        });
    }
}

export default DataSyncSessionArchiver;