import { graphqlApi } from './graphqlApi';

// Queries

const GET_SYNC_DATA_STATE = `
    {
        getSyncDataState {
            notificationsEndpoint
            isSyncRunning
            sessions {
                sessionID
                status
                startedUTC
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

async function getSyncDataState() {
    const response = await graphqlApi.post('', { query: GET_SYNC_DATA_STATE });
    const syncDataState = response.data.data.getSyncDataState;
    return syncDataState;
}

async function syncDataFromErp() {
    await graphqlApi.post('', { query: SYNC_DATA_FROM_ERP });
}


export default {
    getSyncDataState,
    syncDataFromErp
};