import { buildSchema } from 'graphql';

const schema = buildSchema(`
    type Query {
        test: String
    }

    type Mutation {
        syncDataFromErp: Boolean
    }
`);

export { schema };