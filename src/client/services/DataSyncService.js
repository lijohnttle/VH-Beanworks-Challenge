import { graphqlApi } from './graphqlApi';

// Queries

const GET_SYNC_DATA_STATE = `
    {
        getDataSyncState {
            notificationsEndpoint
            isSyncRunning
            sessions {
                sessionID
                status
                startedUTC
                syncLog {
                    timestamp
                    operation
                    state
                    item
                }
            }
        }
    }
`;

const SYNC_DATA_FROM_ERP = `
    mutation {
        syncDataFromErp
    }
`;


// Api calls

async function getDataSyncState() {
    const response = await graphqlApi.post('', { query: GET_SYNC_DATA_STATE });
    const dataSyncState = response.data.data.getDataSyncState;
    return dataSyncState;
}

async function syncDataFromErp() {
    await graphqlApi.post('', { query: SYNC_DATA_FROM_ERP });
}


export default {
    getDataSyncState,
    syncDataFromErp
};