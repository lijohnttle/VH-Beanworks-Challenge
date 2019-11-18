import { buildSchema } from 'graphql';

const schema = buildSchema(`
    type SyncLogRecord {
        timestamp: Float
        operation: String
        state: String
        item: String
    }

    type SyncDataSession {
        sessionID: String!
        status: String!
        startedUTC: Float!
        syncLog: [SyncLogRecord]
    }

    type DataSyncState {
        notificationsEndpoint: String!
        isSyncRunning: Boolean!
        sessions: [SyncDataSession]
    }

    type Query {
        getDataSyncState: DataSyncState
    }

    type Mutation {
        syncDataFromErp: Boolean
    }
`);

export { schema };