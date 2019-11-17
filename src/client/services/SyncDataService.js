import { graphqlApi } from './graphqlApi';

// Queries

const SYNC_DATA_FROM_ERP = `
    mutation {
        syncDataFromErp
    }
`;


// Api calls

async function syncDataFromErp() {
    await graphqlApi.post('', { query: SYNC_DATA_FROM_ERP });
}


export default {
    syncDataFromErp
};