import axios from 'axios';

const graphqlApi = axios.create({
    baseURL: '/graphql'
});

export { graphqlApi };