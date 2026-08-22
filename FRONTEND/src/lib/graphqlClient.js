import { GraphQLClient } from 'graphql-request';

// Configure GraphQL Client endpoint (configurable via environment variable)
const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'https://countries.trevorblades.com/graphql';

export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {
    'Content-Type': 'application/json',
  },
});
