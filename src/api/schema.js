import { buildSchema } from 'graphql';

const schema = buildSchema(`
    type SyncDataSession {
        sessionID: String!
        status: String!
        startedUTC: Float!
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