import { buildSchema } from 'graphql';

const schema = buildSchema(`
    type SyncDataState {
        notificationsEndpoint: String!
        isSyncRunning: Boolean!
    }

    type Query {
        getSyncDataState: SyncDataState
    }

    type Mutation {
        syncDataFromErp: Boolean
    }
`);

export { schema };