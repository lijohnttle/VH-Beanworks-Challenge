class DataSyncManager {
    constructor(loaders, storage) {
        this.loaders = loaders;
        this.storage = storage;
    }

    async syncData() {
        const loads = this.loaders.map(async loader => {
            const data = loader.load();

            this.storage.save(data);
        });

        await Promise.all(loads);
    }
}

export { DataSyncManager };