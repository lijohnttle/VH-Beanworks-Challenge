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

    type SyncDataState {
        notificationsEndpoint: String!
        isSyncRunning: Boolean!
        sessions: [SyncDataSession]
    }

    type Query {
        getSyncDataState: SyncDataState
    }

    type Mutation {
        syncDataFromErp: Boolean
    }
`);

export { schema };